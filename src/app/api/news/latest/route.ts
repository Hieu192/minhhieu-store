// app/api/news/latest/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Sử dụng export này để buộc Next.js render route này một cách dynamic.
// Điều này giải quyết lỗi "Dynamic server usage" khi route cần xử lý các query parameter động.
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Sử dụng request.nextUrl.searchParams là cách an toàn và được khuyến nghị hơn
    const { searchParams } = request.nextUrl;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5; // Mặc định lấy 5 bài nếu không có limit

    // Lấy các bài viết mới nhất, sắp xếp theo ngày giảm dần
    // và giới hạn số lượng theo tham số 'limit'
    const latestNews = await prisma.news.findMany({
      orderBy: {
        date: 'desc', // Sắp xếp theo ngày giảm dần (mới nhất lên trước)
      },
      take: limit, // Giới hạn số lượng bài viết
    });

    return NextResponse.json(latestNews, { status: 200 });
  } catch (error: unknown) {
    console.error('Lỗi khi lấy tin tức mới nhất:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    // Đảm bảo ngắt kết nối Prisma sau mỗi request
    // Lưu ý: Cân nhắc sử dụng một instance Prisma được chia sẻ (@/lib/prisma) để cải thiện hiệu suất
    await prisma.$disconnect();
  }
}
