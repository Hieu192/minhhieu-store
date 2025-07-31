// components/news/ArticleList.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/news'; // Đã cập nhật import Post từ lib/news
import { createCategorySlug } from '@/ultis/helps'; // Import helper

interface ArticleListProps {
  posts: Post[];
}

export default function ArticleList({ posts }: ArticleListProps) {
  return (
    <section className="md:col-span-2 space-y-6">
      {posts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Không tìm thấy bài viết nào.</p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="w-full md:w-1/3 h-48 relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1 p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                <Link href={`/news/${createCategorySlug(post.category)}/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}
              </p>
              <p className="text-gray-700 text-sm line-clamp-3">{post.summary}</p>
            </div>
          </article>
        ))
      )}
    </section>
  );
}