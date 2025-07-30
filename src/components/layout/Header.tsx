'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
} from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import CategoryDropdown from '@/components/layout/CategoryDropdown';
import Image from 'next/image';
import { Category } from '@/types/category';
import SafeImage from '@/ultis/SafeImage';
import { formatPrice } from '@/ultis/helps';
import CategoryDropdownTree from './CategoryDropdownTree';

export default function Header({ categories, categoriesTree, onToggleMobileMenu, isMenuOpen = false, onHeaderClick }: { categories: Category[], categoriesTree: Category[], onToggleMobileMenu?: (open: boolean) => void, isMenuOpen?: boolean, onHeaderClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { getTotalItems } = useCart();
  const debounceRef = useRef<any>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setLoading(true); // 👈 Đặt trước để không bị hiển thị "Không tìm thấy" quá sớm

    debounceRef.current = setTimeout(() => {
      if (value.trim().length === 0) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      fetch(`/api/autocomplete?q=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setLoading(false);
        })
        .catch(() => {
          setSearchResults([]);
          setLoading(false);
        });
    }, 300);
  };

  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const NavButton = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        pathname === href ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header 
        className={`bg-white shadow-md sticky z-50 transition-all duration-300 ${isMenuOpen ? 'translate-x-64 opacity-50' : ''}`}
        onClick={onHeaderClick}
        style={{ 
          cursor: isMenuOpen ? 'pointer' : 'default',
          top: 'env(safe-area-inset-top, 0)',
          paddingTop: 'env(safe-area-inset-top, 0)'
        }}
      >
        {/* Top Bar */}
        <div className="max-w-7xl mt-0 mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">MinhHieu</h1>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-screen-sm mx-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
              onClick={handleSearchSubmit}
            />

            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full rounded-md border border-gray-300 mt-1 w-full bg-white z-50 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleSuggestionClick}
                      className="flex items-center shadow-sm mb-2 px-3 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="border rounded-md"
                      />
                      <div className="ml-3 flex-1">
                        <span className="line-clamp-1">{product.name}</span>
                        <span className="text-sm md:text-base font-bold text-red-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  // 👉 Chỉ hiển thị "Không tìm thấy" khi đã load xong và có từ khóa
                  searchQuery.trim().length > 0 && !loading && (
                    <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy sản phẩm</div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center md:space-x-4 space-x-1">
            <button className="p-2 text-gray-600 hover:text-blue-600 hidden md:inline-block">
              <Heart className="h-6 w-6" />
            </button>

            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              <Search className="h-6 w-6" />
            </button>

            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-blue-600 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <Link
              href="/auth/login"
              className="p-2 text-gray-600 hover:text-blue-600 hidden md:inline-block"
            >
              <User className="h-6 w-6" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={() => {
                onToggleMobileMenu?.(true)
              }}
            >
                <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block border-t border-gray-200">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 py-4">
            <NavButton href="/" label="TRANG CHỦ" />
            <CategoryDropdown categories={categories} />
            <CategoryDropdownTree categories={categoriesTree} />
            <NavButton href="/news" label="TIN TỨC" />
            <NavButton href="/about" label="VỀ CHÚNG TÔI" />
            <NavButton href="/contact" label="LIÊN HỆ" />
          </div>
        </nav>
      </header>

      {/* Mobile Search Overlay - Đặt bên ngoài header để không bị ảnh hưởng bởi sticky */}
      {showMobileSearch && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileSearch(false)} />
          <div className="fixed inset-x-0 top-0 z-50 bg-white px-4 py-4 shadow-md border-b">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm sản phẩm..."
              autoFocus
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search
              className="absolute right-7 top-[50%] translate-y-[-50%] h-5 w-5 text-gray-400 cursor-pointer"
              onClick={handleSearchSubmit}
            />

            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 w-full bg-white z-50 max-h-64 overflow-y-auto shadow-lg">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        handleSuggestionClick();
                        setShowMobileSearch(false); // Ẩn sau khi chọn
                      }}
                      className="flex items-center ml-4 mr-4 bg-gray-100 rounded-lg shadow-sm p-2 mb-2 text-sm text-gray-800 hover:bg-gray-200"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <span className="line-clamp-1">{product.name}</span>
                    </Link>
                  ))
                ) : (
                  searchQuery.trim().length > 0 && !loading && (
                    <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy sản phẩm</div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}