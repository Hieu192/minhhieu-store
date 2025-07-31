// app/api/news/latest/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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
  } catch (error) {
    console.error('Lỗi khi lấy tin tức mới nhất:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Đảm bảo ngắt kết nối Prisma sau mỗi request
  }
}