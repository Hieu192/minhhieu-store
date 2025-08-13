
// src/app/products/page.tsx
import { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';
import Loading from './loading';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { capitalizeWords } from '@/ultis/helps';
import Link from 'next/link';

// Định nghĩa các hàm fetch dữ liệu từ API của bạn
// Các hàm này sẽ chạy trên server
async function getProducts(params: any): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products?${new URLSearchParams(params).toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

async function getTotalProductCount(params: any): Promise<number> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products/count?${new URLSearchParams(params).toString()}`);
    if (!res.ok) {
        throw new Error('Failed to fetch total product count');
    }
    const data = await res.json();
    return data.count || 0;
}

async function getCategoryTree(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/categories/tree`);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

interface ProductsPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
}

const PRODUCTS_PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category || 'all';
  const minPrice = searchParams.minPrice || '';
  const maxPrice = searchParams.maxPrice || '';
  const rating = parseInt(searchParams.rating || '0', 10);
  const sort = searchParams.sort || 'name';
  const page = parseInt(searchParams.page || '1', 10);
  const offset = (page - 1) * PRODUCTS_PER_PAGE;
  
  // Tạo một bộ tham số cho cả hai API
  const apiParams = {
    category,
    minPrice,
    maxPrice,
    rating,
    sort,
    limit: PRODUCTS_PER_PAGE.toString(),
    offset: offset.toString(),
  };

  const [categories, products, totalCount] = await Promise.all([
    getCategoryTree(),
    getProducts(apiParams),
    getTotalProductCount(apiParams),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="md:text-base text-gray-600 mb-4 space-x-1 bg-gray-200 p-3 rounded-md">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          {category === 'all' ? (
            <span className="text-blue-600">Sản phẩm</span>
          ) : (
            <Link href="/products" className="hover:underline">Sản phẩm</Link>
          )}
          {getCategoryPath(category, categories).map((cat) => (
            <span key={cat.id}>
              <span>/</span>
              <Link
                href={`/products?category=${cat.slug}`}
                className={category === cat.slug ? "text-blue-600" : "hover:underline"}
              >
                {capitalizeWords(cat.name)}
              </Link>
            </span>
          ))}
        </div>

        <Suspense fallback={<Loading />}>
          <ProductsClientPage
            initialProducts={products}
            initialCategories={categories}
            initialTotalProducts={totalCount}
            initialSearchParams={searchParams}
            limit={PRODUCTS_PER_PAGE}
          />
        </Suspense>
      </div>
    </div>
  );
}

// ... Hàm getCategoryPath không đổi ...
function getCategoryPath(slug: string, tree: Category[]): Category[] {
  if (slug === 'all') return [];
  const path: Category[] = [];
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