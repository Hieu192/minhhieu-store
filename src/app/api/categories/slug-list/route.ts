import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
) {
  try {
    // Lấy danh sách các danh mục với slug
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    return NextResponse.json({ slugs: categories.map(cat => cat.slug) });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}