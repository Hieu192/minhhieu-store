// app/news/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getNewsPosts, getFeaturedNewsPosts, getLatestNewsPosts, getNewsCategories, Post } from '@/lib/news'; // Import từ lib/news
import { createCategorySlug } from '@/ultis/helps'; // Import helper
import ArticleList from '@/components/news/ArticleList';
import Pagination from '@/components/news/Pagination';

// Để generateMetadata vẫn dùng lib/news-server-data trực tiếp
import { getPostsForStatic, getAllCategoriesForStatic } from '@/lib/news-server-data';


export const metadata: Metadata = {
  title: 'Tin tức thiết bị vệ sinh, bồn cầu, nội thất phòng tắm',
  description:
    'Cập nhật tin tức mới nhất về thiết bị vệ sinh, bồn cầu thông minh, xu hướng thiết kế phòng tắm hiện đại. Tư vấn chọn thiết bị phù hợp.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'Tin tức thiết bị vệ sinh, bồn cầu, nội thất phòng tắm',
    description:
      'Tổng hợp các bài viết, xu hướng và mẹo hay liên quan đến thiết bị vệ sinh và bồn cầu thông minh.',
    url: 'https://yourdomain.com/news',
    images: [
      {
        url: 'https://yourdomain.com/images/news-cover.jpg',
        alt: 'Tin tức thiết bị vệ sinh',
      },
    ],
  },
};

export default async function NewsPage() {
  // Gọi các hàm từ lib/news để lấy dữ liệu qua API routes
  const newsData = await getNewsPosts({ page: 1 });
  const allPosts = newsData.posts;
  const totalPages = newsData.totalPages;
  const categories = newsData.categories;

  const latestPosts = await getLatestNewsPosts();
  const featuredPosts = await getFeaturedNewsPosts();

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="list-none flex space-x-1">
          <li>
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>Tin tức</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-8 text-center">
        Tin tức & Bài viết về thiết bị vệ sinh
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ArticleList posts={allPosts} />

        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Danh mục</h3>
            <ul className="text-sm space-y-1 text-blue-600">
              {categories.map((cat: string) => (
                <li key={cat}>
                  <Link href={`/news/${createCategorySlug(cat)}`} className="hover:underline">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Bài viết nổi bật</h3>
            <ul className="text-sm space-y-3">
              {featuredPosts.map((p: Post) => (
                <li key={p.id}>
                  <Link href={`/news/${createCategorySlug(p.category)}/${p.slug}`} className="text-blue-700 hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Bài viết mới nhất</h3>
            <ul className="text-sm space-y-3">
              {latestPosts.map((p: Post) => (
                <li key={p.id}>
                  <Link href={`/news/${createCategorySlug(p.category)}/${p.slug}`} className="text-blue-700 hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <Pagination currentPage={1} totalPages={totalPages} baseUrl="/news" />
    </main>
  );
}