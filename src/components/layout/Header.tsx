'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const autoClickRef = useRef<any>(null);

  const { getTotalItems } = useCart();
  const debounceRef = useRef<any>(null);

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchQuery(value);
  setShowSuggestions(true);

  // ✅ Mỗi lần người dùng gõ, tự động click lại input để xóa gạch dưới
  if (window.innerWidth >= 768 && inputRef.current) {
    console.log('focus input desktop');
    const input = inputRef.current;
    input.focus();
    const len = input.value.length;
    input.setSelectionRange(len, len);
  } else if (window.innerWidth < 768 && mobileInputRef.current) {
    const input = mobileInputRef.current;
    input.focus();
    const len = input.value.length;
    input.setSelectionRange(len, len);
  }

  if (debounceRef.current) clearTimeout(debounceRef.current);
  setLoading(true);

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
  }, 400);
};



  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    setShowMobileSearch(false)
    setSearchQuery('');
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  // ✅ Thêm logic khi click vào input
  const handleInputClick = () => {
    console.log('Input clicked');
    // Bạn có thể thêm logic xử lý tại đây
    // Ví dụ: commit text từ bộ gõ VNI, hiển thị dropdown, etc.
  };

  const handleSuggestionClick = () => {
    console.log('Suggestion clicked');
    setShowSuggestions(false);
    setShowMobileSearch(false)
    setSearchQuery('');
  };

  const NavButton = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:border-b-2 border-b-blue-600 ${
        pathname === href ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
      }`}
    >
      {label}
    </Link>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

// useEffect(() => {
//   const input = inputRef.current;
//   if (!input) return;

//   const handleCompositionEnd = () => {
//     // Khi người dùng gõ xong (vni, telex...), bạn có thể xử lý tiếp nếu muốn
//     console.log('Composition end, safe to proceed');
//     // Không cần blur/focus gì ở đây
//   };

//   input.addEventListener('compositionend', handleCompositionEnd);
//   return () => {
//     input.removeEventListener('compositionend', handleCompositionEnd);
//   };
// }, []);

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
          <div ref={containerRef} className="hidden md:flex flex-1 max-w-screen-sm mx-8 relative">
            <div className="relative w-full">
              {searchQuery.trim() === '' && (
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 pointer-events-none p-1" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick} // ✅ Thêm event onClick
                placeholder="Tìm kiếm sản phẩm..."
                className={`w-full ${searchQuery.trim() === '' ? 'pl-12 pr-3' : 'pl-3 pr-10'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {searchQuery.trim().split(/\s+/).length >= 2 && (
                <X
                  className="absolute right-12 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSuggestions(false);
                  }}
                />
              )}
              {searchQuery.trim() !== '' && (
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 cursor-pointer hover:bg-gray-200 rounded-full p-1"
                  onClick={handleSearchSubmit}
                />
              )}

              {showSuggestions && searchQuery.trim() !== '' && (
                <div className="absolute top-full rounded-md border border-gray-300 mt-1 w-full bg-white z-50 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Đang tìm kiếm...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick ={handleSuggestionClick}
                        className="flex items-center shadow-sm mb-2 px-3 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      >
                        <SafeImage
                          src={product.image}
                          alt={product.name}
                          // width={60}
                          // height={60}
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
        <nav className="hidden md:block border-gray-200">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 pt-1 min-h-9">
            <NavButton href="/" label="TRANG CHỦ  🏠" />
            <CategoryDropdown categories={categories} />
            <CategoryDropdownTree categories={categoriesTree} />
            <NavButton href="/news" label="TIN TỨC  📰" />
            <NavButton href="/about" label="VỀ CHÚNG TÔI  ℹ️" />
            <NavButton href="/contact" label="LIÊN HỆ  📞" />
          </div>
        </nav>
      </header>

      {/* Mobile Search Overlay - Đặt bén ngoài header để không bị ảnh hưởng bởi sticky */}
      {showMobileSearch && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileSearch(false)} />
          <div className="fixed inset-x-0 top-0 z-50 bg-white px-4 py-4 shadow-md border-b">
            {searchQuery.trim() === '' && (
              <Search className="absolute left-7 top-[50%] translate-y-[-50%] h-5 w-5 text-gray-400 pointer-events-none" />
            )}
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick} // ✅ Thêm event onClick cho mobile
              placeholder="Tìm kiếm sản phẩm..."
              autoFocus
              className={`w-full ${searchQuery.trim() === '' ? 'pl-10 pr-3' : 'pl-3 pr-10'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {searchQuery.trim().split(/\s+/).length >= 2 && (
              <X
                className="absolute right-16 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSuggestions(false);
                }}
              />
            )}

            {searchQuery.trim() !== '' && (
              <Search
                className="absolute right-7 top-[50%] translate-y-[-50%] h-5 w-5 text-gray-400 cursor-pointer"
                onClick={handleSearchSubmit}
              />
            )}

            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 w-full bg-white z-50 max-h-64 overflow-y-auto shadow-lg">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleSuggestionClick}
                      className="flex items-center ml-4 mr-4 bg-gray-100 rounded-lg shadow-sm p-2 mb-2 text-sm text-gray-800 hover:bg-gray-200"
                    >
                        <SafeImage
                          src={product.image}
                          alt={product.name}
                          // width={60}
                          // height={60}
                          className="border rounded-md mr-3"
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