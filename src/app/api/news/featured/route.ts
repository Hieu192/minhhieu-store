// app/api/news/featured/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Sử dụng export này để buộc Next.js render route này một cách dynamic.
// Điều này giải quyết lỗi "Dynamic server usage" vì API này cần xử lý các query parameter động.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Sử dụng request.nextUrl.searchParams là cách an toàn hơn
    // so với việc tạo URL mới từ request.url
    const { searchParams } = request.nextUrl;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 4;

    const featuredNews = await prisma.news.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    });

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
