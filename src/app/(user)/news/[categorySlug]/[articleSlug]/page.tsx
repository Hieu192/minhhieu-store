// app/news/[categorySlug]/[articleSlug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import parse, { DOMNode, Element } from 'html-react-parser';
import { getNewsPostBySlug, getNewsPosts, Post } from '@/lib/news';
import { createCategorySlug, parseContent } from '@/ultis/helps';

import { getAllCategoriesForStatic, getAllPostSlugsForDetailStatic, getPostBySlugForStatic } from '@/lib/news-server-data';
import TableOfContents from '@/components/news/TableOfContents';
import ArticleCard from '@/components/news/ArticleCard';


export async function generateMetadata({ params }: { params: { categorySlug: string; articleSlug: string } }): Promise<Metadata> {
  const post = await getPostBySlugForStatic(params.articleSlug);

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

export async function generateStaticParams() {
    return getAllPostSlugsForDetailStatic();
}

// const parseContent = (htmlContent: string) => {
//   return parse(htmlContent, {
//     replace: (node: DOMNode) => {
//       if (node instanceof Element && node.name === 'img') {
//         const { src, alt, width, height } = node.attribs;
//         return (
//           <Image
//             src={src}
//             alt={alt || ''}
//             width={width ? parseInt(width) : 800}
//             height={height ? parseInt(height) : 600}
//             className="rounded-lg my-6"
//             priority
//           />
//         );
//       }
//       return node;
//     },
//   });
// };

export default async function PostDetailPage({ params }: { params: { categorySlug: string; articleSlug: string } }) {
  const post = await getNewsPostBySlug(params.articleSlug);
  const newsData = await getNewsPosts({ categorySlug: params.categorySlug });
  const categories = newsData.categories;
  const relatedPosts = newsData.posts;

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

  const filteredRelatedPosts = relatedPosts.filter((p: Post) => p.slug !== post.slug).slice(0, 6);
  const popularPosts = relatedPosts.filter((p: Post) => p.slug !== post.slug).slice(0, 3); // Giả sử đây là bài viết xem nhiều
  const parsedContent = parseContent(post.content);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 ">
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4 bg-gray-200 p-4 rounded-lg">
          <ol className="list-none flex space-x-1">
            <li><Link href="/" className="hover:underline hover:text-blue-600">Trang chủ</Link><span className="mx-1">/</span></li>
            <li><Link href="/news" className="hover:underline hover:text-blue-600">Tin tức</Link><span className="mx-1">/</span></li>
            <li><Link href={`/news/${params.categorySlug}`} className="hover:underline hover:text-blue-600">{categoryName}</Link><span className="mx-1">/</span></li>
            <li className='text-blue-600'>{post.title}</li>
          </ol>
        </nav> */}

        <div className="text-sm md:text-base text-gray-600 mb-4 space-x-2 bg-gray-200 p-3 rounded-md flex flex-nowrap overflow-x-auto">
          <Link href="/" className="hover:underline hover:text-blue-600 flex-shrink-0">🏠Trang chủ</Link>
          <span className="mx-1">/</span>
          <Link href="/news" className="hover:underline hover:text-blue-600 flex-shrink-0">Tin tức</Link>
          <span className="mx-1">/</span>
          <Link href={`/news/${params.categorySlug}`} className="hover:underline hover:text-blue-600 flex-shrink-0">{categoryName}</Link>
          <span className="mx-1">/</span>
          <span className='text-blue-600 flex-shrink-0'>{post.title}</span>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Article Content */}
          <div className="md:col-span-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-6">{new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}</p>
            <div className="relative w-full aspect-[5/3] mb-8 rounded-lg overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-contain" priority />
            </div>

            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              {parsedContent}
            </div>
          </div>


          {/* Sidebar */}
          <aside className=" hidden md:col-span-1 md:block ">
            <div className="sticky top-28 space-y-6">
              <TableOfContents />
            </div>
          </aside>
        </div>
        
        {/* Bài viết liên quan (dưới cùng) */}
        {filteredRelatedPosts.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRelatedPosts.map((relatedPost: Post) => (
                <ArticleCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
          // <ArticleList posts={filteredRelatedPosts} />
        )}
      </main>
    </div>

  );
}