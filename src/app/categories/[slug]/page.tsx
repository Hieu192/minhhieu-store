'use client';

import { useParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/Cartcontext';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const [catRes, subCatRes, prodRes, breadcrumbRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/categories/${slug}/children`),
          fetch(`/api/categories/${slug}/products`),
          fetch(`/api/categories/${slug}/breadcrumb`)
        ]);

        if (!catRes.ok || !subCatRes.ok || !prodRes.ok || !breadcrumbRes.ok) throw new Error();

        const catData = await catRes.json();
        const subCatData = await subCatRes.json();
        const prodData = await prodRes.json();
        const breadcrumbData = await breadcrumbRes.json();

        setCategory(catData);
        setProducts(prodData);
        setSubcategories(subCatData || []);
        setBreadcrumb(breadcrumbData || []);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Không tìm thấy danh mục: &quot;{slug}&quot;
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 text-sm text-gray-700 space-x-1 bg-gray-100 p-2 rounded">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          {breadcrumb.map((item, index) => (
            <span key={item.slug}>
              <span>/</span>
              {index === breadcrumb.length - 1 ? (
                <span className="text-blue-600">{item.name}</span>
              ) : (
                <Link href={`/categories/${item.slug}`} className="hover:underline">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {category.name}
        </h1>

        {subcategories.length > 0 && (
          <div className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="block p-4 bg-white shadow hover:shadow-md rounded-md text-center border border-gray-200 hover:bg-gray-100 transition"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <p className="text-gray-600">Không có sản phẩm nào trong danh mục này.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
