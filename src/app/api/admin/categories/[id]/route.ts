import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { deleteFolderFromCloudinary, uploadFileToCloudinary } from '@/ultis/cloudinary';

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


// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const formData = await req.formData();
//     const name = formData.get('name') as string;
//     const level = Number(formData.get('level'));
//     const parentId = formData.get('parentId')
//       ? Number(formData.get('parentId'))
//       : null;
//     const description = formData.get('description') as string;
//     const file = formData.get('image') as File;
//     let thumbnailUrl = formData.get('image') as string;

//     // Tải ảnh lên Cloudinary nếu có file mới
//     // if (file && file.size > 0) {

//     //   const arrayBuffer = await file.arrayBuffer();
//     //   const buffer = Buffer.from(arrayBuffer);

//     //   const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
//     //     cloudinary.uploader
//     //       .upload_stream({ folder: 'ecommerce/categories' }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
//     //         if (error) {
//     //           reject(error);
//     //         } else if (result) {
//     //           resolve(result);
//     //         } else {
//     //           reject(new Error('Unknown Cloudinary upload error'));
//     //         }
//     //       })
//     //       .end(buffer);
//     //   });

//     //   if (uploadResult && uploadResult.secure_url) {
//     //     thumbnailUrl = uploadResult.secure_url;
//     //   }
//     // }

//     const thumbnailUrl: string = await uploadFileToCloudinary(file, 'categories');

//     const slug = slugify(name, {
//       lower: true,
//       strict: true,
//       locale: 'vi',
//     });

//     const category = await prisma.category.update({
//       where: { id: Number(params.id) },
//       data: {
//         name,
//         slug,
//         image: thumbnailUrl, // Cập nhật URL ảnh mới (hoặc giữ nguyên nếu không có file)
//         parentId: parentId || null,
//         level: level ?? 0,
//         description: description || null,
//       },
//     });

//     return NextResponse.json(category);
//   } catch (error) {
//     console.error('[PUT /api/categories/:id]', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id, 10);

    // Kiểm tra xem ID có phải là số hợp lệ không
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const formData = await request.formData();

    // Tìm danh mục hiện tại để lấy dữ liệu cũ
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Khởi tạo một đối tượng data chỉ chứa các trường cần cập nhật
    const updateData: any = {};

    const name = formData.get('name') as string;
    if (name) {
      updateData.name = name;
      // Cập nhật slug nếu tên thay đổi
      if (name !== existingCategory.name) {
        updateData.slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
      }
    }

    const level = Number(formData.get('level'));
    if (!isNaN(level)) updateData.level = level;

    const parentId = formData.get('parentId')
      ? Number(formData.get('parentId'))
      : null;
    if (parentId) updateData.parentId = parentId;

    const description = formData.get('description') as string;
    if (description) updateData.description = description;

    const existingImageUrl = formData.get('image_url') as string | null;

    // Xử lý tệp ảnh đại diện mới
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      updateData.image = await uploadFileToCloudinary(imageFile, 'categories', categoryId.toString());
    } else if (existingImageUrl !== undefined && existingImageUrl !== null) {
      updateData.image = existingImageUrl;
    }

    // Cập nhật danh mục trong cơ sở dữ liệu
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const categoryToDelete = await prisma.category.findUnique({ 
      where: { id: categoryId },
    });

    if (!categoryToDelete) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // const imageUrl = newToDelete.image;

    // if (imageUrl) {
    //   try {
    //     await deleteFileFromCloudinary(imageUrl, newId.toString());
    //   } catch (error) {
    //     console.error('Error deleting image from Cloudinary:', error);
    //   }
    // }

    await deleteFolderFromCloudinary('categories', categoryId.toString());

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { message: 'Danh mục đã được xóa thành công' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[DELETE /api/categories] error:', error);
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return NextResponse.json(
        { error: 'Không tìm thấy danh mục để xóa' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}
