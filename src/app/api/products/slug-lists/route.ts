import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Lấy tất cả các sản phẩm, chỉ chọn trường `slug`
    const products = await prisma.product.findMany({
      select: {
        slug: true,
      },
    });

    // Trích xuất slug từ kết quả và trả về dưới dạng mảng string
    // Bỏ kiểu dữ liệu `Product` để TypeScript tự suy luận kiểu { slug: string } từ kết quả Prisma
    const slugs = products.map((product: { slug: string }) => product.slug);

    return NextResponse.json(slugs);
  } catch (error) {
    console.error('Error fetching product slugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product slugs' },
      { status: 500 }
    );
  }
}
