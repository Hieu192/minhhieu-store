import NewsForm from '@/app/admin/news/components/NewsForm';
import { notFound } from 'next/navigation';

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = params
  
  // Fetch dữ liệu tin tức từ API
  const newsData = await getNewsData(id)

  if (!newsData) {
    return (
      <div className="ml-80 p-6 text-white">
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          Không tìm thấy bài viết tin tức với ID: {id}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Sử dụng key để buộc React phải render lại NewsForm khi id thay đổi.
        Điều này giúp giải quyết lỗi Hydration Mismatch bằng cách đảm bảo 
        component được tạo mới hoàn toàn trên client thay vì cập nhật.
      */}
      <NewsForm key={id} mode="edit" initialData={newsData} />
    </main>
  )
}

// Giả lập hàm getNewsData
async function getNewsData(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/admin/news/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch news data:', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching news data:', error);
    return null;
  }
}