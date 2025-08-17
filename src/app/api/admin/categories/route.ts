import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import slugify from 'slugify'
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { uploadFileToCloudinary } from '@/ultis/cloudinary';

// Lấy tất cả categories
// GET /api/categories?level=0
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    const rawLevel = searchParams.get('level') // có thể '0', '1', null, hoặc ''


    // Build where condition an toàn
    const where: any = {}

    if (rawLevel !== null && rawLevel !== '') {
      const levelNum = Number(rawLevel)
      if (!Number.isNaN(levelNum)) {
        where.level = { equals: levelNum }
      }
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { id: 'desc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('[GET /api/admin/categories] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const level = Number(formData.get('level'));
    const parentId = formData.get('parentId')
      ? Number(formData.get('parentId'))
      : null;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File;

    const tempImage = "placeholder_image_url"; 

    const slug = slugify(name, {
      lower: true,
      strict: true, // bỏ ký tự đặc biệt
      locale: 'vi', // hỗ trợ tiếng Việt
    });

    // Lưu vào database
    const category = await prisma.category.create({
      data: {
        name,
        level,
        slug,
        parentId,
        description,
        image: tempImage,
      },
    });
    const thumbnailUrl: string = await uploadFileToCloudinary(file, 'categories', category.id.toString());

    // Cập nhật lại category với thumbnailUrl
    await prisma.category.update({
      where: { id: category.id },
      data: { image: thumbnailUrl },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Lỗi POST /categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

