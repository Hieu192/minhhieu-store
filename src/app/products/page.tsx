'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/Cartcontext';
import SortDropdown from '@/components/ui/SortDropdown';
import { Grid, List, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Star } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import AnimatedProductCard from '@/components/product/AnimatedProductCard';
import CategoryTreeFilter from '@/components/ui/CategoryTreeFilter';
import { capitalizeWords } from '@/ultis/helps';
import Link from 'next/link';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = parseInt(searchParams.get('rating') || '0', 10);
  const sort = searchParams.get('sort') || '';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [ratingFilter, setRatingFilter] = useState(rating);
  const [sortBy, setSortBy] = useState(sort || 'name');
  const [minPriceState, setMinPriceState] = useState(minPrice);
  const [maxPriceState, setMaxPriceState] = useState(maxPrice);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(pageFromUrl);
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const limit = 12;
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(totalProducts / limit);

  function updateQueryParam(name: string, value: string | number | null) {
    const params = new URLSearchParams(window.location.search);

    if (!value || value === 'all' || value === 0 || value === '') {
      params.delete(name);
    } else {
      params.set(name, String(value));
    }
    if (name !== 'page') params.set('page', '1'); // reset trang khi filter đổi
    router.push(`/products?${params.toString()}`);
  }

  function goToPage(p: number) {
    setPage(p); // set state thay vì update URL
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    router.replace(`/products?${params.toString()}`, { scroll: true });
  }

  function getCategoryPath(slug: string, tree: Category[]): Category[] {
    if (slug === 'all') return [];

    const path: Category[] = [];

    // Hàm đệ quy để tìm đường dẫn
    function findPath(currentSlug: string, categoriesArr: Category[], currentPath: Category[]): boolean {
      for (const cat of categoriesArr) {
        const newPath = [...currentPath, cat];
        if (cat.slug === currentSlug) {
          path.push(...newPath);
          return true;
        }
        if (cat.children && cat.children.length > 0) {
          if (findPath(currentSlug, cat.children, newPath)) {
            return true;
          }
        }
      }
      return false;
    }

    findPath(slug, tree, []);
    return path;
  }

  const handleApply = () => {
    const min = parseInt(minPriceState || '0');
    const max = parseInt(maxPriceState || '0');

    if (minPriceState && maxPriceState && min > max) {
      setErrorMessage('Vui lòng điền khoảng giá phù hợp.');
      return;
    }

    setErrorMessage(''); // clear lỗi nếu hợp lệ

    const params = new URLSearchParams(window.location.search);

    if (minPriceState !== '') {
      params.set('minPrice', minPriceState);
    } else {
      params.delete('minPrice');
    }

    if (maxPriceState !== '') {
      params.set('maxPrice', maxPriceState);
    } else {
      params.delete('maxPrice');
    }

    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setPage(parseInt(searchParams.get('page') || '1', 10));
    setMinPriceState(searchParams.get('minPrice') || ''); // Thêm để đồng bộ giá
    setMaxPriceState(searchParams.get('maxPrice') || ''); // Thêm để đồng bộ giá
    setRatingFilter(parseInt(searchParams.get('rating') || '0', 10)); // Thêm để đồng bộ rating
    setSortBy(searchParams.get('sort') || 'name'); // Thêm để đồng bộ sort
  }, [searchParams]); // Phụ thuộc vào searchParams để cập nhật lại state

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1');
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [searchParams, page]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories/tree');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Lỗi fetch danh mục:', err);
      }
    }

    fetchCategories();
  }, []);

  const searchParamsToString = searchParams.toString();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        params.set('limit', limit.toString());
        params.set('offset', offset.toString());

        const [resProducts, resCount] = await Promise.all([
          fetch(`/api/products?${params.toString()}`, { signal }),
          fetch(`/api/products/count?${params.toString()}`, { signal }),
        ]);

        const dataProducts = await resProducts.json();
        const dataCount = await resCount.json();

        setProducts(Array.isArray(dataProducts) ? dataProducts : []);
        setTotalProducts(dataCount.count || 0);
        setHasFetched(true);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // 🔁 Bỏ qua fetch bị hủy
          return;
        }
        console.error('❌ Lỗi fetch:', err);
        setProducts([]);
        setTotalProducts(0);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [searchParams, offset]);

  const currentCategoryPath = getCategoryPath(selectedCategory, categories);
  const isProductsActive = selectedCategory === 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="md:text-base text-gray-600 mb-4 space-x-1 bg-gray-200 p-3 rounded-md">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          {isProductsActive ? (
            <span className="text-blue-600">Sản phẩm</span> // Nếu active, chỉ là span, không hover, không click
          ) : (
            <Link
              href="/products"
              className="hover:underline" // Chỉ underline khi không active
              onClick={() => {
                setSelectedCategory('all');
                updateQueryParam('category', null);
              }}
            >
              Sản phẩm
            </Link>
          )}
          
          {currentCategoryPath.map((cat, index) => {
            // Kiểm tra xem đây có phải là danh mục đang active không
            const isActiveCategory = selectedCategory === cat.slug;

            return (
              <span key={cat.id}>
                <span>/</span>
                {isActiveCategory ? ( // Nếu active, chỉ là span, không hover, không click
                  <span className="text-blue-600">
                    {capitalizeWords(cat.name)}
                  </span>
                ) : (
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="hover:underline" // Chỉ underline khi không active
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      updateQueryParam('category', cat.slug);
                    }}
                  >
                    {capitalizeWords(cat.name)}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-blue-600"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Bộ lọc
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`w-full lg:w-64 space-y-6 ${showFilters ? '' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded shadow-md space-y-4">
              <CategoryTreeFilter
                categoriesTree={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                updateQueryParam={updateQueryParam}
              />

              {/* Price Filter */}
              <div className="border-b-2 pb-4">
                <h3 className="font-semibold mb-2">Khoảng Giá</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Từ"
                    value={minPriceState}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setMinPriceState(val);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm appearance-none"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Đến"
                    value={maxPriceState}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setMaxPriceState(val);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm appearance-none"
                  />
                </div>

                {/* Hiển thị lỗi nếu có */}
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}

                <button
                  type="button"
                  onClick={handleApply}
                  className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition justify-center w-full"
                >
                  Áp dụng
                </button>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold mb-2">Đánh Giá</h3>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const isSelected = ratingFilter === star;

                    return (
                      <button
                        key={star}
                        onClick={() => {
                          if (isSelected) {
                            setRatingFilter(0); // Bỏ lọc nếu đã chọn
                            updateQueryParam('rating', null);
                          } else {
                            setRatingFilter(star);
                            updateQueryParam('rating', star);
                          }
                        }}
                        className={`flex items-center text-sm w-full text-left px-2 py-1 rounded-full transition ${
                          isSelected
                            ? 'bg-gray-200 text-gray-800 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {/* Hiển thị sao vàng và sao xám */}
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`mr-1 ${
                              i < star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        {star !== 5 && (
                          <span className="ml-2">trở lên</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="space-y-2 mb-4">
              <span className="text-sm text-gray-600 block">
                Hiển thị {products.length} / {totalProducts} sản phẩm
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                  <SortDropdown
                    value={sortBy}
                    onChange={(val) => {
                      setSortBy(val);
                      updateQueryParam('sort', val);
                    }}
                  />
              </div>
            </div>

            <div
              className={`grid gap-2 md:gap-3 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {loading ? (
                <div className="col-span-full min-h-[400px] flex items-center justify-center">
                  {/* Loading spinner */}
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0s" }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              ) : hasFetched && products.length === 0 ? (
                <div className="col-span-full min-h-[400px] flex items-center justify-center">
                  <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
                </div>
              ) : (
                products.map((product) => (
                  <AnimatedProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))
              )}
            </div>
              {!loading && totalPages > 0 && (
                <div className="mt-6 flex justify-center flex-wrap">
                  {/* First */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={page === 1}
                    className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"
                >
                  <span className="hidden md:inline">First</span>
                  <ChevronsLeft className="w-4 h-4 md:hidden"/>
                </button>

                {/* Prev */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-1 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"

                >
                  <span className="hidden md:inline">Prev</span>
                  <ChevronLeft className="w-4 h-4 md:hidden" />
                </button>

                {/* Pages */}
                {(() => {
                  const pages = [];

                  const showLeftDots = page > 3;
                  const showRightDots = page < totalPages - 2;

                  // Always show page 1
                  pages.push(
                    <button
                      key={1}
                      onClick={() => goToPage(1)}
                      className={`px-3 py-1 border text-xs md:text-base ${
                        page === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                      }`}
                    >
                      1
                    </button>
                  );

                  // Left ellipsis
                  if (showLeftDots) {
                    pages.push(
                      <span key="left-dots" className="px-2 py-1 text-xs md:text-base text-gray-500">
                        ...
                      </span>
                    );
                  }

                  // Middle pages
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`px-3 py-1 border text-xs md:text-base ${
                          page === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Right ellipsis
                  if (showRightDots) {
                    pages.push(
                      <span key="right-dots" className="px-2 py-1 text-xs md:text-base text-gray-500">
                        ...
                      </span>
                    );
                  }

                  // Always show last page if more than 1 page
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => goToPage(totalPages)}
                        className={`px-3 py-1 border text-xs md:text-base ${
                          page === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}

                {/* Next */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-1 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"

                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-4 h-4 md:hidden" />
                </button>

                {/* Last */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"

                >
                  <span className="hidden md:inline">Last</span>
                  <ChevronsRight className="w-4 h-4 md:hidden" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
