// app/news/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { dummyNews } from '@/data/dummyNews';
import Link from 'next/link';

interface Props {
  params: {
    slug: string;
  };
}

export default function NewsDetailPage({ params }: Props) {
  const post = dummyNews.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-sm text-gray-500 mb-2">
        {new Date(post.date).toLocaleDateString('vi-VN')} •{' '}
        <Link href={`/news?cat=${post.category}`} className="text-blue-600 hover:underline">
          {post.category}
        </Link>
      </p>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>

      <div className="w-full h-64 relative rounded-lg overflow-hidden mb-6">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <article className="prose max-w-none prose-blue prose-sm sm:prose lg:prose-lg">
        {post.content}
      </article>
    </div>
  );
}
