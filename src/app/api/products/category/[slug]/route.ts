import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Params {
  params: { slug: string };
}

export async function GET(req: Request, { params }: Params) {
  const { slug } = params;

  try {
    // Tìm category theo slug
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) return notFound();

    let categoryIds: number[] = [];

    if (category.parentId === null) {
      // Là category cha → lấy toàn bộ con + chính nó
      const subCategories = await prisma.category.findMany({
        where: { parentId: category.id },
        select: { id: true },
      });

      categoryIds = [category.id, ...subCategories.map((c) => c.id)];
    } else {
      // Là category con → chỉ lấy chính nó
      categoryIds = [category.id];
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by category slug:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
