// app/news/page/[page]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getNewsPosts, getFeaturedNewsPosts, getLatestNewsPosts, Post } from '@/lib/news'; // Import từ lib/news
import { createCategorySlug } from '@/ultis/helps'; // Import helper
import ArticleList from '@/components/news/ArticleList';
import Pagination from '@/components/news/Pagination';

// Cho generateMetadata và generateStaticParams
import { getPostsForStatic, getAllNewsPageSlugsForStatic } from '@/lib/news-server-data';
import Image from 'next/image';
import ArticleSidebar from '@/components/news/ArticleSlibar';


// Hàm generateMetadata động
export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  const pageNumber = parseInt(params.page, 10);
  const { totalPages } = await getPostsForStatic({ page: pageNumber }); // Dùng hàm từ lib/news-server-data

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    return {
      title: 'Trang không tìm thấy',
      description: 'Trang tin tức bạn đang tìm kiếm không tồn tại.',
    };
  }

  const title = `Tin tức - Trang ${pageNumber} | Thiết bị vệ sinh`;
  const description = `Các bài viết mới nhất về thiết bị vệ sinh, bồn cầu thông minh (Trang ${pageNumber}).`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/news/page/${pageNumber}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://yourdomain.com/news/page/${pageNumber}`,
      images: [
        {
          url: 'https://yourdomain.com/images/news-cover.jpg',
          alt: title,
        },
      ],
    },
  };
}

// Hàm generateStaticParams để tiền tạo các trang phân trang
export async function generateStaticParams() {
  return getAllNewsPageSlugsForStatic(); // Dùng hàm từ lib/news-server-data
}

export default async function NewsPaginatedPage({ params }: { params: { page: string } }) {
  const pageNumber = parseInt(params.page, 10);

  // Gọi các hàm từ lib/news để lấy dữ liệu qua API routes
  const newsData = await getNewsPosts({ page: pageNumber });
  const paginatedPosts = newsData.posts;
  const totalPages = newsData.totalPages;
  const categories = newsData.categories;

  const latestPosts = await getLatestNewsPosts();
  const featuredPosts = await getFeaturedNewsPosts();

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages || paginatedPosts.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Trang không tìm thấy</h1>
        <p className="text-gray-600">Xin lỗi, trang tin tức bạn đang tìm kiếm không tồn tại.</p>
        <Link href="/news" className="text-blue-600 hover:underline mt-4 inline-block">
          Quay lại trang tin tức
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4 bg-gray-200 p-3 rounded-lg">
        <ol className="list-none flex flex-nowrap overflow-x-auto">
          <li className='flex-shrink-0'>
            <Link href="/" className="hover:underline">
              🏠Trang chủ
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className='flex-shrink-0'>
            <Link href="/news" className="hover:underline">
              Tin tức
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className='flex-shrink-0'>Trang {pageNumber}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-8 text-center">
        Tin tức & Bài viết về thiết bị vệ sinh (Trang {pageNumber})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ArticleList posts={paginatedPosts} />

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

      <Pagination currentPage={pageNumber} totalPages={totalPages} baseUrl="/news" />

    </main>
  );
}