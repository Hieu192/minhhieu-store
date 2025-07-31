// app/api/news/featured/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn này đúng

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 4; // Mặc định lấy 4 bài nổi bật

    const featuredNews = await prisma.news.findMany({
      where: {
        isFeatured: true, // Lọc các bài viết có isFeatured là true
      },
      orderBy: {
        date: 'desc', // Sắp xếp theo ngày giảm dần (mới nhất lên trước)
      },
      take: limit, // Giới hạn số lượng bài viết
    });

    // Chuyển đổi Date objects sang ISO strings trước khi gửi đi
    const formattedNews = featuredNews.map(p => ({
      ...p,
      date: p.date.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedNews, { status: 200 });
  } catch (error: unknown) {
    console.error('Lỗi khi lấy tin tức nổi bật:', error);
    const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
    return NextResponse.json(
      { message: 'Không thể lấy tin tức nổi bật', error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}