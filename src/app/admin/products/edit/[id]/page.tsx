import ProductForm from '@/app/admin/products/components/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

// Hàm này sẽ gọi API để lấy dữ liệu sản phẩm
async function getProductData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products/${id}`, { cache: 'no-store' });
    
    console.log("test::::", res)
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product data');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productData = await getProductData(params.id);

  if (!productData) {
    notFound();
  }

  return <ProductForm mode="edit" initialData={productData} />;
}