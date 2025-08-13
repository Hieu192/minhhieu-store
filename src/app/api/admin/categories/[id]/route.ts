import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(params.id) },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('[GET /api/categories/:id]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const level = Number(formData.get('level'));
    const parentId = formData.get('parentId')
      ? Number(formData.get('parentId'))
      : null;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File | null;
    let thumbnailUrl = formData.get('image') as string | null;

    // Tải ảnh lên Cloudinary nếu có file mới
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'ecommerce/categories' }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Unknown Cloudinary upload error'));
            }
          })
          .end(buffer);
      });

      thumbnailUrl = uploadResult.secure_url;
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });

    const category = await prisma.category.update({
      where: { id: Number(params.id) },
      data: {
        name,
        slug,
        image: thumbnailUrl, // Cập nhật URL ảnh mới (hoặc giữ nguyên nếu không có file)
        parentId: parentId || null,
        level: level ?? 0,
        description: description || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[PUT /api/categories/:id]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
