// file: app/api/products/slug-list/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const slugParam = req.nextUrl.searchParams.get('slugs'); // ví dụ: "abc,def,xyz"

  if (!slugParam) {
    return NextResponse.json({ error: 'Missing slugs parameter' }, { status: 400 });
  }

  const slugs = slugParam.split(',').map(s => s.trim()).filter(Boolean);

  try {
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs } },
    });

    // Sắp xếp đúng thứ tự theo `slugs`
    const ordered = slugs.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean);

    return NextResponse.json(ordered);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
