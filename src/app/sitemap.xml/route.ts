// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const res = await fetch(`${baseUrl}/api/products`);
  const products = await res.json();

  const urls = products
    .map((p: any) => `<url><loc>${baseUrl}/products/${p.slug}</loc></url>`)
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
