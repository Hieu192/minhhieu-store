// app/news/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getNewsPosts, getFeaturedNewsPosts, getLatestNewsPosts, getNewsCategories, Post } from '@/lib/news'; // Import từ lib/news
import { createCategorySlug } from '@/ultis/helps'; // Import helper
import ArticleList from '@/components/news/ArticleList';
import Pagination from '@/components/news/Pagination';

// Để generateMetadata vẫn dùng lib/news-server-data trực tiếp
import { getPostsForStatic, getAllCategoriesForStatic } from '@/lib/news-server-data';
import Image from 'next/image';
import ArticleSidebar from '@/components/news/ArticleSlibar';


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
    <div className="min-h-screen bg-gray-50 py-4 px-4 ">
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4 bg-gray-200 p-4 rounded-lg">
          <ol className="list-none flex space-x-1">
            <li>
              <Link href="/" className="hover:underline hover:text-blue-600">
                Trang chủ
              </Link>
              <span className="mx-1">/</span>
            </li>
            <li className="text-blue-600">Tin tức</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Tin tức & Bài viết về thiết bị vệ sinh
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ArticleList posts={allPosts} />

          {/* Sidebar */}
          <aside className="space-y-6">
            <div >
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
              {/* <ul className="text-sm space-y-3">
                {featuredPosts.map((post: Post) => (
                  <li key={post.id}>
                    <Link href={`/news/${createCategorySlug(post.category)}/${post.slug}`}>
                      <article className="flex gap-4 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden p-3">
                        <div className="w-1/3 h-24 relative">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                            priority
                            // loading='lazy'
                          />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-base font-semibold text-gray-800 hover:text-blue-600 min-h-[3rem]">
                            {post.title}
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul> */}
              <ArticleSidebar posts={featuredPosts} />
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Bài viết mới nhất</h3>
              {/* <ul className="text-sm space-y-3">
                {latestPosts.map((post: Post) => (
                  <li key={post.id}>
                    <Link href={`/news/${createCategorySlug(post.category)}/${post.slug}`}>
                      <article className="flex gap-4 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden p-3">
                        <div className="w-1/3 h-24 relative">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                            priority
                            // loading='lazy'
                          />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-base font-semibold text-gray-800 hover:text-blue-600">
                            {post.title}
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul> */}
              <ArticleSidebar posts={latestPosts} />
            </div>
          </aside>
        </div>

        <Pagination currentPage={1} totalPages={totalPages} baseUrl="/news" />
      </main>
    </div>

  );
}