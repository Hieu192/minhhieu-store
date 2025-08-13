import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/news";
import { createCategorySlug } from "@/ultis/helps";

interface ArticleSidebarProps {
  posts: Post[];
}

export default function ArticleSidebar({ posts }: ArticleSidebarProps) {
  if (posts.length === 0) return null;

  return (
    <ul className="text-sm space-y-3">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={`/news/${createCategorySlug(post.category)}/${post.slug}`}
          >
            <article className="flex gap-4 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden p-3">
              <div className="w-1/3 aspect-[5/3] relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-contain rounded"
                  priority
                />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-800 hover:text-blue-600 min-h-[4rem] line-clamp-3">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.date).toLocaleDateString("vi-VN")} •{" "}
                  {post.category}
                </p>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}
