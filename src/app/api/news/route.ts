// app/api/news/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn này đúng tới prisma client của bạn
import { createCategorySlug } from '@/ultis/helps'; // Đảm bảo đường dẫn này đúng

const POSTS_PER_PAGE = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const categorySlug = searchParams.get('categorySlug');
  const limit = parseInt(searchParams.get('limit') || String(POSTS_PER_PAGE), 10);

  try {
    const whereClause: any = {};
    if (categorySlug) {
      const allCategoriesFromDb = await prisma.news.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      const categoryName = allCategoriesFromDb.map(c => c.category).find(cat => createCategorySlug(cat) === categorySlug);

      if (categoryName) {
        whereClause.category = categoryName;
      } else {
        return NextResponse.json({ posts: [], totalPosts: 0, totalPages: 0, categories: allCategoriesFromDb.map(c => c.category) });
      }
    }

    const totalPosts = await prisma.news.count({ where: whereClause });
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await prisma.news.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const allCategories = await prisma.news.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' }
    });

    return NextResponse.json({
      posts: posts.map(p => ({ ...p, date: p.date.toISOString() })),
      totalPosts,
      totalPages,
      categories: allCategories.map(c => c.category)
    });
  } catch (error: unknown) { // Thêm kiểu 'unknown' cho error
    console.error('Error fetching news:', error);
    // Kiểm tra nếu error là một instance của Error để truy cập message an toàn
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch news', error: errorMessage }, { status: 500 });
  }
}