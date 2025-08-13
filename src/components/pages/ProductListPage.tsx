// 📁 components/pages/ProductListPage.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/Cartcontext';
import SortDropdown from '@/components/ui/SortDropdown';
import { ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Star } from 'lucide-react';
import AnimatedProductCard from '@/components/product/AnimatedProductCard';
import CategoryTreeFilter from '@/components/ui/CategoryTreeFilter';
import { capitalizeWords } from '@/ultis/helps';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { useRouter } from 'next/navigation';

interface Props {
  categories: Category[];
  products: Product[];
  totalProducts: number;
  currentFilters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    rating: number;
    sort: string;
    page: number;
  };
}

export default function ProductListPage({
  categories,
  products,
  totalProducts,
  currentFilters,
}: Props) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [minPriceState, setMinPriceState] = useState(currentFilters.minPrice);
  const [maxPriceState, setMaxPriceState] = useState(currentFilters.maxPrice);
  const [ratingFilter] = useState(currentFilters.rating);
  const [sortBy] = useState(currentFilters.sort);
  const [viewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedCategory = currentFilters.category;
  const page = currentFilters.page;
  const limit = 12;
  const totalPages = Math.ceil(totalProducts / limit);

  const getCategoryPath = (slug: string, tree: Category[]): Category[] => {
    if (slug === 'all') return [];
    const path: Category[] = [];
    function findPath(currentSlug: string, categoriesArr: Category[], currentPath: Category[]): boolean {
      for (const cat of categoriesArr) {
        const newPath = [...currentPath, cat];
        if (cat.slug === currentSlug) {
          path.push(...newPath);
          return true;
        }
        if (cat.children && findPath(currentSlug, cat.children, newPath)) {
          return true;
        }
      }
      return false;
    }
    findPath(slug, tree, []);
    return path;
  };

  const currentCategoryPath = getCategoryPath(selectedCategory, categories);
  const isProductsActive = selectedCategory === 'all';

  const updateQueryParam = (name: string, value: string | number | null) => {
    const params = new URLSearchParams(window.location.search);
    if (!value || value === 'all' || value === 0 || value === '') {
      params.delete(name);
    } else {
      params.set(name, String(value));
    }
    if (name !== 'page') params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="md:text-base text-gray-600 mb-4 space-x-1 bg-gray-200 p-3 rounded-md">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          {isProductsActive ? (
            <span className="text-blue-600">Sản phẩm</span>
          ) : (
            <Link href="/products" className="hover:underline">Sản phẩm</Link>
          )}
          {currentCategoryPath.map((cat) => (
            <span key={cat.id}>
              <span>/</span>
              <Link
                href={`/products?category=${cat.slug}`}
                className={selectedCategory === cat.slug ? 'text-blue-600' : 'hover:underline'}
              >
                {capitalizeWords(cat.name)}
              </Link>
            </span>
          ))}
        </div>

        <div className="lg:hidden mb-4">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center text-sm font-medium text-blue-600">
            <ChevronDown className="h-4 w-4 mr-1" /> Bộ lọc
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`w-full lg:w-64 space-y-6 ${showFilters ? '' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded shadow-md space-y-4">
              <CategoryTreeFilter
                categoriesTree={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={(val: string) => updateQueryParam('category', val)}
                updateQueryParam={updateQueryParam}
              />
              <div className="border-b-2 pb-4">
                <h3 className="font-semibold mb-2">Khoảng Giá</h3>
                <div className="flex gap-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Từ" value={minPriceState} onChange={(e) => setMinPriceState(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                  <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Đến" value={maxPriceState} onChange={(e) => setMaxPriceState(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                </div>
                {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded w-full"
                  onClick={() => {
                    updateQueryParam('minPrice', minPriceState);
                    updateQueryParam('maxPrice', maxPriceState);
                  }}
                >
                  Áp dụng
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Đánh Giá</h3>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      className={`flex items-center text-sm px-2 py-1 rounded-full ${ratingFilter === star ? 'bg-gray-200 font-medium' : ''}`}
                      onClick={() => updateQueryParam('rating', ratingFilter === star ? null : star)}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={`mr-1 ${i < star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      {star !== 5 && <span className="ml-2">trở lên</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-2 mb-4">
              <span className="text-sm text-gray-600 block">Hiển thị {products.length} / {totalProducts} sản phẩm</span>
              <div className="flex items-center gap-2 flex-wrap">
                <SortDropdown value={sortBy} onChange={(val) => updateQueryParam('sort', val)} />
              </div>
            </div>

            <div className={`grid gap-2 md:gap-3 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {products.map((product) => (
                <AnimatedProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>

            {totalPages > 0 && (
              <div className="mt-6 flex justify-center flex-wrap">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => updateQueryParam('page', i + 1)}
                    className={`px-3 py-1 border text-xs md:text-base ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
