import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    // const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || '';
    const limit = Number(searchParams.get('limit') || 10);
    const finalLimit = Number.isFinite(limit) ? limit : 10;
    const offset = Number.isFinite(Number(searchParams.get('offset'))) ? Number(searchParams.get('offset')) : 0;

    // Tìm category theo slug
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Tìm các category con (nếu có)
    const subcategories = await prisma.category.findMany({
      where: { parentId: category.id },
      select: { id: true },
    });

    // Tập hợp tất cả categoryId để query sản phẩm
    const categoryIds = [category.id, ...subcategories.map((c) => c.id)];
    // Sắp xếp
    const orderBy = (() => {
      if (sort === 'price-low') return { price: 'asc' as const };
      if (sort === 'price-high') return { price: 'desc' as const };
      if (sort === 'rating') return { rating: 'desc' as const };
      if (sort === 'newest') return { createdAt: 'desc' as const };
      return { name: 'asc' as const };
    })();

    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds,
        },
      },
      orderBy,
      skip: offset,
      take: finalLimit,
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
    console.error('Error fetching products by category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// // Map các field được phép sort
// function sortMap(sort: string): 'createdAt' | 'rating' | 'reviews' | 'price' {
//   const allowed = ['createdAt', 'rating', 'reviews', 'price'] as const;
//   return allowed.includes(sort as any) ? (sort as any) : 'createdAt';
// }
