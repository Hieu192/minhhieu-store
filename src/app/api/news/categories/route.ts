// app/api/news/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn này đúng

export async function GET() {
  try {
    const categories = await prisma.news.findMany({
      select: {
        category: true, // Chỉ chọn trường 'category'
      },
      distinct: ['category'], // Lấy các giá trị category duy nhất
      orderBy: {
        category: 'asc', // Sắp xếp theo tên category tăng dần
      },
    });

    // Trích xuất chỉ tên category từ kết quả
    const categoryNames = categories.map(c => c.category);

    return NextResponse.json(categoryNames, { status: 200 });
  } catch (error: unknown) {
    console.error('Lỗi khi lấy danh mục tin tức:', error);
    const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
    return NextResponse.json(
      { message: 'Không thể lấy danh mục tin tức', error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}