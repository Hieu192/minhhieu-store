// app/news/[categorySlug]/[articleSlug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getNewsPostBySlug, getNewsPosts, Post } from '@/lib/news'; // Import từ lib/news
import { createCategorySlug } from '@/ultis/helps'; // Import helper

// Cho generateMetadata và generateStaticParams
import { getAllCategoriesForStatic, getAllPostSlugsForDetailStatic, getPostBySlugForStatic } from '@/lib/news-server-data';


// Hàm generateMetadata động cho từng bài viết
export async function generateMetadata({ params }: { params: { categorySlug: string; articleSlug: string } }): Promise<Metadata> {
  const post = await getPostBySlugForStatic(params.articleSlug); // Dùng hàm từ lib/news-server-data

  if (!post) {
    return {
      title: 'Bài viết không tìm thấy',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại.',
    };
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/news/${params.categorySlug}/${params.articleSlug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://yourdomain.com/news/${params.categorySlug}/${params.articleSlug}`,
      images: [
        {
          url: `https://yourdomain.com${post.image}`,
          alt: post.title,
        },
      ],
    },
  };
}

// Hàm generateStaticParams để tạo các trang tĩnh tại thời điểm build
export async function generateStaticParams() {
    return getAllPostSlugsForDetailStatic(); // Dùng hàm từ lib/news-server-data
}

export default async function PostDetailPage({ params }: { params: { categorySlug: string; articleSlug: string } }) {
  // Gọi các hàm từ lib/news để lấy dữ liệu qua API routes
  const post = await getNewsPostBySlug(params.articleSlug);
  const newsData = await getNewsPosts({ categorySlug: params.categorySlug }); // Lấy dữ liệu category và related posts
  const categories = newsData.categories;
  const relatedPosts = newsData.posts; // posts ở đây đã được lọc theo categorySlug

  const categoryName = categories.find((cat: string) => createCategorySlug(cat) === params.categorySlug);

  if (!post || !categoryName || createCategorySlug(post.category) !== params.categorySlug) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Bài viết không tìm thấy</h1>
        <p className="text-gray-600">Xin lỗi, bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link href="/news" className="text-blue-600 hover:underline mt-4 inline-block">
          Quay lại trang tin tức
        </Link>
      </main>
    );
  }

  // Lọc bài viết liên quan (trong cùng danh mục)
  const filteredRelatedPosts = relatedPosts.filter((p: Post) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="list-none flex space-x-1">
          <li>
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>
            <Link href="/news" className="hover:underline">
              Tin tức
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>
            <Link href={`/news/${params.categorySlug}`} className="hover:underline">
                {categoryName}
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>{post.title}</li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {post.title}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}
      </p>

      <div className="relative w-full h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Render nội dung bài viết */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
           dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Bài viết liên quan */}
      {filteredRelatedPosts.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Bài viết liên quan</h3>
          <ul className="list-disc list-inside space-y-2">
            {filteredRelatedPosts.map((relatedPost: Post) => (
              <li key={relatedPost.id}>
                <Link href={`/news/${createCategorySlug(relatedPost.category)}/${relatedPost.slug}`} className="text-blue-600 hover:underline">
                  {relatedPost.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}