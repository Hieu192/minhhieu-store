// app/api/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length === 0) {
    return NextResponse.json([]);
  }

  try {
    // Lấy các category khớp tên
    const matchingCategories = await prisma.category.findMany({
      where: {
        name: {
          contains: q.toLowerCase(),
        },
      },
      select: { id: true },
    });

    const categoryIds = matchingCategories.map((cat) => cat.id);

    // Truy vấn sản phẩm theo tên hoặc theo category
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q.toLowerCase(),
            },
          },
          {
            categoryId: {
              in: categoryIds,
            },
          },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        image: true,
        originalPrice: true,
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error('Autocomplete API error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
