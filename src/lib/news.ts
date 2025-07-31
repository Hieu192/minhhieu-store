// lib/news.ts
import { News } from '@prisma/client'; // Import News model từ Prisma Client để có kiểu dữ liệu
import { createCategorySlug } from '@/ultis/helps'; // Import helper

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

// Định nghĩa kiểu Post cho phía client, đảm bảo date là string
export type Post = Omit<News, 'date' | 'createdAt' | 'updatedAt'> & { date: string; createdAt: string; updatedAt: string; };

interface GetPostsResponse {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  categories: string[];
}

export async function getNewsPosts(options?: { categorySlug?: string; page?: number; limit?: number }): Promise<GetPostsResponse> {
  const { categorySlug, page = 1, limit } = options || {};
  let url = `${API_BASE}/api/news?page=${page}`;
  if (categorySlug) {
    url += `&categorySlug=${categorySlug}`;
  }
  if (limit) {
    url += `&limit=${limit}`;
  }

  const res = await fetch(url, { cache: 'no-store' }); // Sử dụng cache: 'no-store' để đảm bảo luôn lấy dữ liệu mới nhất nếu cần
  if (!res.ok) {
    throw new Error(`Failed to fetch news posts: ${res.statusText}`);
  }
  return res.json();
}

export async function getNewsCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/news/categories`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch news categories: ${res.statusText}`);
  }
  return res.json();
}

export async function getFeaturedNewsPosts(limit: number = 4): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/api/news/featured?limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch featured news posts: ${res.statusText}`);
  }
  return res.json();
}

export async function getLatestNewsPosts(limit: number = 4): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/api/news/latest?limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch latest news posts: ${res.statusText}`);
  }
  return res.json();
}

export async function getNewsPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/api/news/${slug}`, { cache: 'no-store' });
  if (res.status === 404) {
    return null; // Không tìm thấy bài viết
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch news post by slug ${slug}: ${res.statusText}`);
  }
  return res.json();
}

// Các hàm cho generateStaticParams sẽ phải gọi trực tiếp logic DB
// vì chúng chạy ở build time (hoặc request time nếu không phải static)
// và không nên phụ thuộc vào API endpoint để tránh vòng lặp hoặc hiệu suất kém.
// Do đó, chúng ta sẽ giữ các hàm này trong một file riêng như `lib/news-static-paths.ts`
// hoặc bạn có thể giữ nó trong `lib/post-db.ts` (tên cũ `lib/post.ts`)
// và các `page.tsx` sẽ import từ đó cho generateStaticParams.
