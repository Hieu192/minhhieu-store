// app/news/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

const dummyPosts = [
  {
    id: 1,
    title: 'Xu hướng thiết kế nội thất 2025',
    slug: 'thiet-ke-noi-that-2025',
    image: '/images/news1.jpg',
    summary:
      'Khám phá những phong cách nội thất đang lên ngôi và phù hợp với không gian sống hiện đại.',
    date: '2025-06-26',
    category: 'Thiết kế',
  },
  {
    id: 2,
    title: 'Top 10 thiết bị vệ sinh nên dùng',
    slug: 'top-thiet-bi-ve-sinh',
    image: '/images/news2.jpg',
    summary:
      'Danh sách các thiết bị vệ sinh chất lượng cao được người dùng đánh giá tốt nhất 2025.',
    date: '2025-06-24',
    category: 'Thiết bị',
  },
  // Thêm bài viết khác...
];

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Tin tức & Bài viết</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Nội dung chính */}
        <div className="md:col-span-2 space-y-6">
          {dummyPosts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="w-full md:w-1/3 h-48 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">{post.summary}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Danh mục</h3>
            <ul className="text-sm space-y-1 text-blue-600">
              <li><Link href="/news?cat=thiet-bi">Thiết bị</Link></li>
              <li><Link href="/news?cat=thiet-ke">Thiết kế</Link></li>
              <li><Link href="/news?cat=meo-hay">Mẹo hay</Link></li>
              <li><Link href="/news?cat=tin-tuc">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Bài viết nổi bật</h3>
            <ul className="text-sm space-y-3">
              {dummyPosts.slice(0, 2).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/news/${p.slug}`}
                    className="text-blue-700 hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
