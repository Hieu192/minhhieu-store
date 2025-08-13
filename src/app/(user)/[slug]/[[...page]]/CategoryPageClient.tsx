'use client';

import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/Cartcontext';
import { useState } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import Link from 'next/link';
import { capitalizeWords } from '@/ultis/helps';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import SortDropdown from '@/components/ui/SortDropdown';
import SafeImage from '@/ultis/SafeImage';

interface Props {
  slug: string;
  category: Category;
  subcategories: Category[];
  breadcrumb: { name: string; slug: string }[];
  products: Product[];
  totalProducts: number;
  page: number;
  sort: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CategoryPageClient({
  slug,
  category,
  subcategories,
  breadcrumb,
  products,
  totalProducts,
  page,
  sort,
  searchParams,
}: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState(sort);

  const limit = 10;
  const totalPages = Math.ceil(totalProducts / limit);

  // Hàm chuyển trang
  function goToPage(targetPage: number) {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    let path = `/${slug}`;
    if (targetPage > 1) {
      path = `${path}/page/${targetPage}`;
    }
    const paramString = params.toString();
    router.push(`${path}${paramString ? `?${paramString}` : ''}`);
  }

  // Hàm cập nhật tham số URL cho việc sắp xếp
  function updateQueryParam(name: string, value: string | number | null) {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (!value || value === 'all' || value === 0 || value === '') {
      params.delete(name);
    } else {
      params.set(name, String(value));
    }
    const paramString = params.toString();
    // Giữ nguyên page hiện tại khi thay đổi sort
    let path = `/${slug}`;
    if (page > 1) {
      path = `${path}/page/${page}`;
    }
    router.push(`${path}${paramString ? `?${paramString}` : ''}`);
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
                    // width={100}
                    // height={100}
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

        {products.length === 0 ? (
          <p className="text-gray-600">Không có sản phẩm nào trong danh mục này.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center flex-wrap">
          <button onClick={() => goToPage(1)} disabled={page === 1} className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50">
            <span className="hidden md:inline">First</span>
            <ChevronsLeft className="w-4 h-4 md:hidden" />
          </button>

          <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-1 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50">
            <span className="hidden md:inline">Prev</span>
            <ChevronLeft className="w-4 h-4 md:hidden" />
          </button>

          {/* Pages */}
          {(() => {
            const pages = [];
            const showLeftDots = page > 3;
            const showRightDots = page < totalPages - 2;

            pages.push(
              <button key={1} onClick={() => goToPage(1)} className={`px-3 py-1 border text-xs md:text-base ${page === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
                1
              </button>
            );

            if (showLeftDots) {
              pages.push(<span key="left-dots" className="px-2 py-1 text-xs md:text-base text-gray-500">...</span>);
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);
            for (let i = start; i <= end; i++) {
              pages.push(
                <button key={i} onClick={() => goToPage(i)} className={`px-3 py-1 border text-xs md:text-base ${page === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
                  {i}
                </button>
              );
            }

            if (showRightDots) {
              pages.push(<span key="right-dots" className="px-2 py-1 text-xs md:text-base text-gray-500">...</span>);
            }

            if (totalPages > 1) {
              pages.push(
                <button key={totalPages} onClick={() => goToPage(totalPages)} className={`px-3 py-1 border text-xs md:text-base ${page === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-1 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50">
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4 md:hidden" />
          </button>

          <button onClick={() => goToPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-base border bg-white text-gray-600 disabled:opacity-50">
            <span className="hidden md:inline">Last</span>
            <ChevronsRight className="w-4 h-4 md:hidden" />
          </button>
        </div>
      </div>
    </div>
  );
}