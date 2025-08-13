import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Params {
  params: { slug: string };
}

export async function GET(req: Request, { params }: Params) {
  const { slug } = params;

  try {

    if (slug === '.well-known') {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const parentCategory = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
      },
    });

    if (!parentCategory) return notFound();

    const children = await prisma.category.findMany({
      where: {
        parentId: parentCategory.id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching child categories:', error);
    return NextResponse.json({ error: 'Failed to fetch child categories' }, { status: 500 });
  }
}
