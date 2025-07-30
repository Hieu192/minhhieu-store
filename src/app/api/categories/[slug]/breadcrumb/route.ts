// /app/api/categories/[slug]/breadcrumb/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const chain: { name: string; slug: string }[] = [];

  let current = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, parentId: true },
  });

  while (current) {
    chain.unshift({ name: current.name, slug: current.slug });
    if (!current.parentId) break;

    current = await prisma.category.findUnique({
      where: { id: current.parentId },
      select: { id: true, name: true, slug: true, parentId: true },
    });
  }

  return NextResponse.json(chain); // [{name: 'Bồn cầu', slug: 'bon-cau'}, ...]
}
