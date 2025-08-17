import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { deleteFileFromCloudinary, deleteFolderFromCloudinary, uploadFileToCloudinary } from '@/ultis/cloudinary';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = parseInt(params.id, 10);

    // Kiểm tra xem ID có phải là số hợp lệ không
    if (isNaN(newsId)) {
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 });
    }
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}

/**
 * API Route: PATCH /api/admin/news/[id]
 * Chức năng: Cập nhật một bài viết tin tức hiện có.
 * Yêu cầu: Nhận FormData và id của bài viết.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = parseInt(params.id, 10);

    // Kiểm tra xem ID có phải là số hợp lệ không
    if (isNaN(newsId)) {
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 });
    }

    const formData = await request.formData();

    // Tìm bài viết hiện tại để lấy dữ liệu cũ
    const existingNewsArticle = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!existingNewsArticle) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    // Khởi tạo một đối tượng data chỉ chứa các trường cần cập nhật
    const updateData: any = {};

    const title = formData.get('title') as string;
    if (title) {
      updateData.title = title;
      // Cập nhật slug nếu tiêu đề thay đổi
      if (title !== existingNewsArticle.title) {
        updateData.slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
      }
    }

    const category = formData.get('category') as string;
    if (category) updateData.category = category;

    const summary = formData.get('summary') as string;
    if (summary) updateData.summary = summary;

    const content = formData.get('content') as string;
    if (content) updateData.content = content;

    const isFeatured = formData.get('isFeatured') as string;
    if (isFeatured !== null) {
      updateData.isFeatured = isFeatured === 'true';
    }

    const existingImageUrl = formData.get('image_url') as string | null;

    // Xử lý tệp ảnh đại diện mới
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      updateData.image = await uploadFileToCloudinary(imageFile, 'news', newsId.toString());
    } else if (existingImageUrl !== undefined && existingImageUrl !== null) {
      updateData.image = existingImageUrl;
    }
    
    // Cập nhật bài viết trong cơ sở dữ liệu
    const updatedNewsArticle = await prisma.news.update({
      where: { id: newsId },
      data: updateData,
    });

    return NextResponse.json(updatedNewsArticle, { status: 200 });
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 });
  }
}


// Hàm DELETE để xóa bài viết
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newId = parseInt(params.id, 10);

    if (isNaN(newId)) {
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 });
    }

    const newToDelete = await prisma.news.findUnique({
      where: { id: newId },
    });

    if (!newToDelete) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    // const imageUrl = newToDelete.image;

    // if (imageUrl) {
    //   try {
    //     await deleteFileFromCloudinary(imageUrl, newId.toString());
    //   } catch (error) {
    //     console.error('Error deleting image from Cloudinary:', error);
    //   }
    // }

    await deleteFolderFromCloudinary('news', newId.toString());

    await prisma.news.delete({
      where: { id: newId },
    });

    return NextResponse.json(
      { message: 'Bài viết đã được xóa thành công' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[DELETE /api/news] error:', error);
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return NextResponse.json(
        { error: 'Không tìm thấy bài viết để xóa' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}