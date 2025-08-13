// src/app/products/ProductsClientPage.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCart } from '@/context/Cartcontext';
import SortDropdown from '@/components/ui/SortDropdown';
import { Grid, List, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Star } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import AnimatedProductCard from '@/components/product/AnimatedProductCard';
import CategoryTreeFilter from '@/components/ui/CategoryTreeFilter';

interface ProductsClientPageProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialTotalProducts: number;
  initialSearchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
  limit: number;
}

export default function ProductsClientPage({
  initialProducts,
  initialCategories,
  initialTotalProducts,
  initialSearchParams,
  limit,
}: ProductsClientPageProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(true);

  // States đồng bộ với initialSearchParams
  const [selectedCategory, setSelectedCategory] = useState(initialSearchParams.category || 'all');
  const [ratingFilter, setRatingFilter] = useState(parseInt(initialSearchParams.rating || '0', 10));
  const [sortBy, setSortBy] = useState(initialSearchParams.sort || 'name');
  const [minPriceState, setMinPriceState] = useState(initialSearchParams.minPrice || '');
  const [maxPriceState, setMaxPriceState] = useState(initialSearchParams.maxPrice || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(totalProducts / limit);

  function updateQueryParam(name: string, value: string | number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all' || value === 0 || value === '') {
      params.delete(name);
    } else {
      params.set(name, String(value));
    }
    if (name !== 'page') params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }
  
  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.replace(`/products?${params.toString()}`, { scroll: true });
  }

  const handleApply = () => {
    const min = parseInt(minPriceState || '0');
    const max = parseInt(maxPriceState || '0');
    if (minPriceState && maxPriceState && min > max) {
      setErrorMessage('Vui lòng điền khoảng giá phù hợp.');
      return;
    }
    setErrorMessage('');
    const params = new URLSearchParams(searchParams.toString());
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

  // Effect để fetch lại data khi search params thay đổi trên client
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchNewProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', limit.toString());
      params.set('offset', ((page - 1) * limit).toString());

      try {
        const [resProducts, resCount] = await Promise.all([
          fetch(`/api/products?${params.toString()}`, { signal }),
          fetch(`/api/products/count?${params.toString()}`, { signal }),
        ]);

        const dataProducts = await resProducts.json();
        const dataCount = await resCount.json();

        setProducts(dataProducts || []);
        setTotalProducts(dataCount.count || 0);
        setHasFetched(true);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('❌ Lỗi fetch:', err);
        setProducts([]);
        setTotalProducts(0);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };
    
    // Luôn fetch lại dữ liệu khi searchParams thay đổi.
    // Điều này đảm bảo giao diện luôn được làm mới.
    fetchNewProducts();
    
    // Đồng bộ lại tất cả các state khác với URL
    setSelectedCategory(searchParams.get('category') || 'all');
    setMinPriceState(searchParams.get('minPrice') || '');
    setMaxPriceState(searchParams.get('maxPrice') || '');
    setRatingFilter(parseInt(searchParams.get('rating') || '0', 10));
    setSortBy(searchParams.get('sort') || 'name');
    setPage(parseInt(searchParams.get('page') || '1', 10)); // Cập nhật lại page từ searchParams

    return () => controller.abort();
  }, [searchParams, limit, page]);

  console.log('Product :::', products);

  return (
    <>
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
              categoriesTree={initialCategories}
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
                  onChange={(e) => setMinPriceState(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm appearance-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Đến"
                  value={maxPriceState}
                  onChange={(e) => setMaxPriceState(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm appearance-none"
                />
              </div>
              {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
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
            className={`grid gap-2 md:gap-3 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}
          >
            {loading ? (
              <div className="col-span-full min-h-[400px] flex items-center justify-center">
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
                <AnimatedProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))
            )}
          </div>
          {!loading && totalPages > 0 && (
            <div className="mt-6 flex justify-center flex-wrap">
              {/* Nút Về trang đầu */}
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"
              >
                <span className="hidden md:inline">First</span>
                <ChevronsLeft className="w-4 h-4 md:hidden" />
              </button>
              {/* Nút Về trang trước */}
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-1 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"
              >
                <span className="hidden md:inline">Prev</span>
                <ChevronLeft className="w-4 h-4 md:hidden" />
              </button>

              {/* Logic render các nút số trang */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // Hiển thị 1 trang trước và 1 trang sau trang hiện tại
                if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`px-3 py-1 border text-xs md:text-base ${page === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      {p}
                    </button>
                  );
                }
                // Hiển thị dấu ... nếu cần
                if (
                  (p === page - 2 && page > 3) ||
                  (p === page + 2 && page < totalPages - 2)
                ) {
                  return (
                    <span key={p} className="px-3 py-1 border text-xs md:text-base bg-white text-gray-600">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Nút Đến trang tiếp */}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-1 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4 md:hidden" />
              </button>
              {/* Nút Đến trang cuối */}
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
    </>
  );
}