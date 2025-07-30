'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/Cartcontext';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import Link from 'next/link';
import { capitalizeWords } from '@/ultis/helps';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import SortDropdown from '@/components/ui/SortDropdown';
import SafeImage from '@/ultis/SafeImage';

export default function CategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; slug: string }[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);     // metadata: category, breadcrumb
  const [loadingProducts, setLoadingProducts] = useState(true); // product list
  const [totalProducts, setTotalProducts] = useState(0);

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || '';
  const [page, setPage] = useState(pageFromUrl);
  const [notFound, setNotFound] = useState(false);
  const [sortBy, setSortBy] = useState(sort || 'name');


  const limit = 10; // Số sản phẩm mỗi trang
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(totalProducts / limit);


  function goToPage(p: number) {
    setPage(p); // set state thay vì update URL
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    router.replace(`/${slug}?${params.toString()}`, { scroll: true });
  }

  function updateQueryParam(name: string, value: string | number | null) {
    const params = new URLSearchParams(window.location.search);

    if (!value || value === 'all' || value === 0 || value === '') {
      params.delete(name);
    } else {
      params.set(name, String(value));
    }
    if (name !== 'page') params.set('page', '1'); // reset trang khi filter đổi
    router.push(`/${slug}?${params.toString()}`);
  }

  const searchParamsToString = searchParams.toString();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoadingProducts(true);
      setProducts([]); // xóa sản phẩm cũ ngay
      try {
        const params = new URLSearchParams(window.location.search);
        params.set('limit', limit.toString());
        params.set('offset', offset.toString());

        const resProducts = await fetch(`/api/categories/${slug}/products?${params.toString()}`, { signal });
        const dataProducts = await resProducts.json();

        if (Array.isArray(dataProducts)) {
          setProducts(dataProducts);
        } else {
          console.error('❌ API không trả về mảng:', dataProducts);
        }

        const resCount = await fetch(`/api/products/count?category=${slug}`, { signal });
        const dataCount = await resCount.json();
        setTotalProducts(dataCount.count || 0);
      } catch (err) {
        console.error('❌ Lỗi fetch:', err);
      } finally {
        setLoadingProducts(false);
      }
    })();

    return () => controller.abort();
  }, [searchParamsToString, offset, slug]);


  useEffect(() => {
    if (!slug) return;
    setLoadingMeta(true);
    const fetchData = async () => {
      try {
        const [catRes, subCatRes, breadcrumbRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/categories/${slug}/children`),
          fetch(`/api/categories/${slug}/breadcrumb`)
        ]);

        if (!catRes.ok) {
          setNotFound(true);
          return;
        }

        const catData = await catRes.json();
        const subCatData = await subCatRes.json();
        const breadcrumbData = await breadcrumbRes.json();

        setCategory(catData);
        setSubcategories(subCatData || []);
        setBreadcrumb(breadcrumbData || []);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoadingMeta(false);
      }
    };

    fetchData();
  }, [slug]);

  const loading = loadingMeta || loadingProducts;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="flex justify-center items-center py-20">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Không tìm thấy danh mục: &quot;{slug}&quot;
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 ">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="md:text-base text-gray-600 mb-4 space-x-1 bg-gray-200 p-3 rounded-md">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          {breadcrumb.map((item, index) => (
            <span key={item.slug}>
              <span className="mr-1">/</span>
              {index === breadcrumb.length - 1 ? (
                <span className="text-blue-600">{capitalizeWords(item.name)}</span>
              ) : (
                <Link href={`/${item.slug}`} className="hover:underline">
                  {capitalizeWords(item.name)}
                </Link>
              )}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          {category?.name.toUpperCase()}
        </h1>

        {subcategories.length > 0 && (
          <div className="mb-10">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${sub.slug}`}
                  className="block bg-white shadow hover:shadow-md rounded-lg text-center border border-blue-600 hover:bg-gray-100 transition"
                >
                  <SafeImage
                    src={sub.image}
                    alt={sub.name}
                    width={100}
                    height={100}
                    className=" w-full rounded-tl-lg rounded-tr-lg"
                  />
                  <div className="px-2 py-2 text-base font-medium text-gray-800 min-h-[4rem]">
                    {capitalizeWords(sub.name)}
                  </div>

                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap mb-4">
            <SortDropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                updateQueryParam('sort', val);
              }}
            />
        </div>

        {loading ? (
          <div className="col-span-full min-h-[400px] flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0s" }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-600">Không có sản phẩm nào trong danh mục này.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {loading ? (
          // 👇 Hiện spinner / nền trắng
          <div>
          </div>
          ) : (
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
  );
}
