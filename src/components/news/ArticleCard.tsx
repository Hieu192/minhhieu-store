import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/news";
import { createCategorySlug } from "@/ultis/helps";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article 
      key={post.id}
      className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Link href={`/news/${createCategorySlug(post.category)}/${post.slug}`}>
        <div className="w-full aspect-[5/3] relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 min-h-[3.5rem] line-clamp-3">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(post.date).toLocaleDateString("vi-VN")} • {post.category}
          </p>
          <p className="text-gray-700 text-sm line-clamp-3">{post.summary}</p>
        </div>
      </Link>
    </article>
  );
}
