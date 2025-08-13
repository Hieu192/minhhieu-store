// app/categories/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import Link from 'next/link';

// --- Sử dụng generateMetadata để tạo metadata động cho SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'https://yourdomain.com';
  
  // Fetch dữ liệu danh mục cho metadata
  const res = await fetch(`${baseUrl}/api/categories/${params.slug}`);

  if (!res.ok) {
    // Trả về metadata mặc định nếu không tìm thấy danh mục
    return { title: 'Không tìm thấy danh mục' };
  }

  const category: Category = await res.json();
  const title = `${category.name} | Danh mục`;
  const description = category.description || `Khám phá các sản phẩm chất lượng cao trong danh mục ${category.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // Thêm hình ảnh nếu có
      // images: [category.image],
    },
  };
}

// --- Component chính để render trang danh mục ---
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'https://yourdomain.com';
  const { slug } = params;

  try {
    const [catRes, subCatRes, prodRes, breadcrumbRes] = await Promise.all([
      fetch(`${baseUrl}/api/categories/${slug}`, { next: { revalidate: 3600 } }), // ISR: Cập nhật sau 1 giờ
      fetch(`${baseUrl}/api/categories/${slug}/children`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/categories/${slug}/products`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/categories/${slug}/breadcrumb`, { next: { revalidate: 3600 } })
    ]);

    // Kiểm tra và xử lý lỗi
    if (!catRes.ok) {
      notFound(); // Tự động hiển thị trang 404
    }

    const category: Category = await catRes.json();
    const subcategories: Category[] = await subCatRes.json();
    const products: Product[] = await prodRes.json();
    const breadcrumb: { name: string; slug: string }[] = await breadcrumbRes.json();

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
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

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Danh mục con</h2>
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

          {/* Products */}
          {products.length === 0 ? (
            <p className="text-gray-600">Không có sản phẩm nào trong danh mục này.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    // Xử lý lỗi chung khi fetch
    console.error('Failed to fetch category data:', err);
    notFound();
  }
}