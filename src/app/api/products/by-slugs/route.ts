// /app/api/products/by-slugs/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slugsParam = searchParams.get('slugs'); // "slug1,slug2"

  if (!slugsParam) {
    return NextResponse.json({ error: 'Missing slugs' }, { status: 400 });
  }

  const slugs = slugsParam.split(',').filter(Boolean);

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { 
      category: true,
      variants: true
    },
  });

  return NextResponse.json(products);
}
