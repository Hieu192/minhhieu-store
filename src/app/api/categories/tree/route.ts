import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    const map = new Map<number, any>();
    const roots: any[] = [];

    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    for (const cat of categories) {
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) parent.children.push(map.get(cat.id));
      } else {
        roots.push(map.get(cat.id));
      }
    }

    return NextResponse.json(roots);
  } catch (error) {
    console.error('[GET /api/categories/tree]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
