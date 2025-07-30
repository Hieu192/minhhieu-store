import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '0');
  const rating = parseFloat(searchParams.get('rating') || '0');
  const sort = searchParams.get('sort') || '';
  const limit = Number.isFinite(Number(searchParams.get('limit'))) ? Number(searchParams.get('limit')) : 12;
  const offset = Number.isFinite(Number(searchParams.get('offset'))) ? Number(searchParams.get('offset')) : 0;

  try {
    const where: any = {};

    // Tìm tất cả categoryId nếu có category slug
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

    // Tìm theo từ khóa
    if (search) {
      where.OR = [
        {
          name: {
            contains: search.toLowerCase(),
            mode: 'insensitive',
          },
        },
        {
          category: {
            is: {
              name: {
                contains: search.toLowerCase(),
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    // Lọc theo giá
    if (!isNaN(minPrice) && minPrice > 0) {
      where.price = { ...(where.price || {}), gte: minPrice };
    }

    if (!isNaN(maxPrice) && maxPrice > 0) {
      where.price = { ...(where.price || {}), lte: maxPrice };
    }

    // Lọc theo rating
    if (!isNaN(rating) && rating > 0) {
      where.rating = { gte: rating };
    }

    // Sắp xếp
    const orderBy = (() => {
      if (sort === 'price-low') return { price: 'asc' as const };
      if (sort === 'price-high') return { price: 'desc' as const };
      if (sort === 'rating') return { rating: 'desc' as const };
      if (sort === 'newest') return { createdAt: 'desc' as const };
      return { name: 'asc' as const };
    })();

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        rating: true,
        price: true,
        originalPrice: true,
        badges: true,
        categoryId: true,
        reviews: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách sản phẩm:', error);
    return NextResponse.json({ error: 'Lỗi server khi lấy danh sách sản phẩm' }, { status: 500 });
  }
}
