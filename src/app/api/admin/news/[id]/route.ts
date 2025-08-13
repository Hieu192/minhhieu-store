import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { uploadFileToCloudinary } from '@/ultis/cloudinary';

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
      updateData.image = await uploadFileToCloudinary(imageFile);
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
