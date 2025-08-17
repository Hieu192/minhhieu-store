import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '0');
  const rating = parseFloat(searchParams.get('rating') || '0');
  const sort = searchParams.get('sort') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search.toLowerCase(),
            mode: 'insensitive'
          },
        },
        {
          category: {
            is: {
              name: {
                contains: search.toLowerCase(),
                mode: 'insensitive'
              },
            },
          },
        },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
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

    const orderBy = (() => {
      if (sort === 'price-low') return { price: 'asc' as const };
      if (sort === 'price-high') return { price: 'desc' as const };
      if (sort === 'rating') return { rating: 'desc' as const };
      return { name: 'asc' as const };
    })();

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip: offset,
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách sản phẩm:', error);
    return NextResponse.json({ error: 'Lỗi server khi lấy danh sách sản phẩm' }, { status: 500 });
  }
}
