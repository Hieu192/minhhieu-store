// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import { dummyNews } from '@/data/dummyNews';
// import Link from 'next/link';
// import type { Metadata } from 'next';
// import { NewsArticleJsonLd } from '@/components/seo/NewsArticleJsonLd';

// interface Props {
//   params: {
//     slug: string;
//   };
// }

// // Tạo metadata động cho từng bài viết
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const post = dummyNews.find((p) => p.slug === params.slug);
//   if (!post) return {};

//   return {
//     title: post.title,
//     description: post.summary,
//     openGraph: {
//       title: post.title,
//       description: post.summary,
//       type: 'article',
//       publishedTime: post.date,
//       url: `https://yourdomain.com/news/${post.slug}`,
//       images: [
//         {
//           url: `https://yourdomain.com${post.image}`,
//           alt: post.title,
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: post.title,
//       description: post.summary,
//       images: [`https://yourdomain.com${post.image}`],
//     },
//   };
// }

// export default function NewsDetailPage({ params }: Props) {
//   const post = dummyNews.find((p) => p.slug === params.slug);

//   if (!post) return notFound();

//   return (
//     <main className="max-w-7xl mx-auto px-4 py-10">
//       {/* Breadcrumb (SEO tốt hơn nữa) */}
//       <nav className="text-sm text-gray-500 mb-2">
//         <Link href="/" className="hover:underline">Trang chủ</Link> /{' '}
//         <Link href="/news" className="hover:underline">Tin tức</Link> /{' '}
//         <span className="text-gray-700">{post.title}</span>
//       </nav>

//       <p className="text-sm text-gray-500 mb-2">
//         {new Date(post.date).toLocaleDateString('vi-VN')} •{' '}
//         <Link href={`/news?cat=${post.category}`} className="text-blue-600 hover:underline">
//           {post.category}
//         </Link>
//       </p>

//       <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>

//       <div className="w-full h-64 relative rounded-lg overflow-hidden mb-6">
//         <Image
//           src={post.image}
//           alt={post.title}
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       <article className="prose max-w-none prose-blue prose-sm sm:prose lg:prose-lg">
//         {post.content}
//       </article>

//       {/* JSON-LD cho SEO */}
//       <NewsArticleJsonLd post={post} />
//     </main>
//   );
// }
