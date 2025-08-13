import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NewsStatus, Prisma } from '@prisma/client';
// import type { Prisma } from '@prisma/client';
import { uploadFileToCloudinary } from '@/ultis/cloudinary';
import slugify from 'slugify';

// Hàm GET để lấy danh sách bài viết
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm và lọc
    const whereClause: Prisma.NewsWhereInput = {};
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    if (search) {
      whereClause.title = {
        contains: search.toLowerCase(), // Tìm kiếm không phân biệt chữ hoa chữ thường
      };
    }
    if (status) {
      whereClause.status = status as NewsStatus;
    }

    const totalNews = await prisma.news.count({
      where: whereClause,
    });

    const news = await prisma.news.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
    });

    const totalPages = Math.ceil(totalNews / limit);

    return NextResponse.json({
      news,
      pagination: {
        totalNews,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('[GET /api/news] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    const category = formData.get('category') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const isFeatured = formData.get('isFeatured') === 'true';

    // Xử lý tệp ảnh đại diện
    const imageFile = formData.get('image') as File;
    const imageUrl: string = await uploadFileToCloudinary(imageFile)

    // Tạo bài viết mới trong cơ sở dữ liệu
    const newNewsArticle = await prisma.news.create({
      data: {
        title,
        slug,
        category,
        summary,
        content,
        isFeatured,
        image: imageUrl,
      },
    });

    return NextResponse.json(newNewsArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 });
  }
}

// // Hàm DELETE để xóa bài viết
// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json(
//         { error: 'ID của bài viết là bắt buộc' },
//         { status: 400 }
//       );
//     }

//     await prisma.news.delete({
//       where: { id: parseInt(id, 10) },
//     });

//     return NextResponse.json(
//       { message: 'Bài viết đã được xóa thành công' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('[DELETE /api/news] error:', error);
//     if (error instanceof Error && error.message.includes('Record to delete not found')) {
//       return NextResponse.json(
//         { error: 'Không tìm thấy bài viết để xóa' },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(
//       { error: 'Lỗi máy chủ nội bộ' },
//       { status: 500 }
//     );
//   }
// }
