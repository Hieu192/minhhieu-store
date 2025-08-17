// app/news/[categorySlug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getNewsPosts, getFeaturedNewsPosts, getLatestNewsPosts, Post } from '@/lib/news'; // Import từ lib/news
import { createCategorySlug } from '@/ultis/helps'; // Import helper
import ArticleList from '@/components/news/ArticleList';
import Pagination from '@/components/news/Pagination';

// Cho generateMetadata và generateStaticParams
import { getAllCategoriesForStatic, getAllCategorySlugsForStatic, getPostsForStatic } from '@/lib/news-server-data';
import Image from 'next/image';
import ArticleSidebar from '@/components/news/ArticleSlibar';


// Hàm generateMetadata động cho từng category
export async function generateMetadata({ params }: { params: { categorySlug: string } }): Promise<Metadata> {
  const categories = await getAllCategoriesForStatic(); // Dùng hàm từ lib/news-server-data
  const categoryName = categories.find(cat => createCategorySlug(cat) === params.categorySlug);

  const title = categoryName ? `Tin tức ${categoryName} | Thiết bị vệ sinh` : 'Danh mục không tìm thấy';
  const description = categoryName ? `Tổng hợp các bài viết, hướng dẫn và xu hướng về ${categoryName} trong lĩnh vực thiết bị vệ sinh.` : 'Danh mục bài viết không tồn tại.';

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/news/${params.categorySlug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://yourdomain.com/news/${params.categorySlug}`,
      images: [
        {
          url: 'https://yourdomain.com/images/news-cover.jpg',
          alt: title,
        },
      ],
    },
  };
}

// Hàm generateStaticParams để tiền tạo các trang danh mục
export async function generateStaticParams() {
  return getAllCategorySlugsForStatic(); // Dùng hàm từ lib/news-server-data
}

export default async function CategoryNewsPage({ params }: { params: { categorySlug: string } }) {
  // Gọi các hàm từ lib/news để lấy dữ liệu qua API routes
  const newsData = await getNewsPosts({ categorySlug: params.categorySlug, page: 1 });
  const postsByCategory = newsData.posts;
  const totalPages = newsData.totalPages;
  const categories = newsData.categories;

  const categoryName = categories.find((cat: string) => createCategorySlug(cat) === params.categorySlug);

  if (!categoryName) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Danh mục không tìm thấy</h1>
        <p className="text-gray-600">Xin lỗi, danh mục bạn đang tìm kiếm không tồn tại.</p>
        <Link href="/news" className="text-blue-600 hover:underline mt-4 inline-block">
          Quay lại trang tin tức
        </Link>
      </main>
    );
  }

  const latestPosts = await getLatestNewsPosts();
  const featuredPosts = await getFeaturedNewsPosts();

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 ">
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4 bg-gray-200 p-3 rounded-lg">
          <ol className="list-none flex flex-nowrap overflow-x-auto">
            <li className='flex-shrink-0'>
              <Link href="/" className="hover:underline hover:text-blue-600">
                🏠Trang chủ
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className='flex-shrink-0'>
              <Link href="/news" className="hover:underline hover:text-blue-600">
                Tin tức
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-blue-600">{categoryName}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Tin tức & Bài viết về {categoryName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ArticleList posts={postsByCategory} />

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* <div>
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
            </div> */}

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

        <Pagination currentPage={1} totalPages={totalPages} baseUrl={`/news/${params.categorySlug}`} />

      </main>
    </div>

  );
}