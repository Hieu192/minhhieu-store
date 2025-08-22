import ProductForm from '@/app/admin/products/components/ProductForm';
import { notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

// Hàm này sẽ gọi API để lấy dữ liệu sản phẩm
async function getProductData(id: string) {
  const cookieHeader = cookies().toString(); // Next 14+
  const host = headers().get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'http'; // product thì đổi thành https
  const url = `${protocol}://${host}/api/admin/products/${id}`;

  const res = await fetch(url, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
    redirect: 'manual',      // Đừng auto-follow 302 -> login
  });

  // Nếu middleware redirect về /admin/login
  if (res.status === 302 || res.status === 307) {
    return null; // hoặc throw để bắt ở ngoài
  }

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product data (${res.status})`);

  // Chắn content-type để tránh parse nhầm HTML
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Unexpected content-type: ${ct}. Body: ${text.slice(0,120)}...`);
  }

  return res.json();
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productData = await getProductData(params.id);

console.log('EditProductPage productData:', productData);
  if (!productData) {
    notFound();
  }

  return <ProductForm mode="edit" initialData={productData} />;
}