// app/api/news/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn này đúng

// Định nghĩa props cho hàm GET để nhận slug
interface NewsPostParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: NewsPostParams) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ message: 'Slug không được cung cấp' }, { status: 400 });
  }

  try {
    const newsPost = await prisma.news.findUnique({
      where: {
        slug: slug, // Tìm bài viết theo slug
      },
    });

    if (!newsPost) {
      return NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    // Chuyển đổi Date objects sang ISO strings trước khi gửi đi
    const formattedPost = {
      ...newsPost,
      date: newsPost.date.toISOString(),
      createdAt: newsPost.createdAt.toISOString(),
      updatedAt: newsPost.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy bài viết với slug "${slug}":`, error);
    const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
    return NextResponse.json(
      { message: 'Không thể lấy bài viết', error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}