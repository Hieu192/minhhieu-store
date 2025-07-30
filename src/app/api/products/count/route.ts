import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '0');
  const rating = parseFloat(searchParams.get('rating') || '0');

  try {
    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search, // ❌ bỏ mode
          },
        },
        {
          category: {
            is: {
              name: {
                contains: search, // ❌ bỏ mode
              },
            },
          },
        },
      ];
    }

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });

      if (category) {
        const subcategories = await prisma.category.findMany({
          where: { parentId: category.id },
          select: { id: true },
        });

        const categoryIds = [category.id, ...subcategories.map((c) => c.id)];
        where.categoryId = { in: categoryIds };
      }
    }

    if (!isNaN(minPrice) && minPrice > 0) {
      where.price = { ...(where.price || {}), gte: minPrice };
    }

    if (!isNaN(maxPrice) && maxPrice > 0) {
      where.price = { ...(where.price || {}), lte: maxPrice };
    }

    if (!isNaN(rating) && rating > 0) {
      where.rating = { gte: rating };
    }

    const count = await prisma.product.count({
      where,
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('❌ Lỗi khi đếm sản phẩm:', error);
    return NextResponse.json({ error: 'Lỗi server khi đếm sản phẩm' }, { status: 500 });
  }
}
