import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import slugify from 'slugify';
import { uploadFileToCloudinary } from '@/ultis/cloudinary';

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const searchParams = url.searchParams;

//     // Lấy tham số page và limit từ URL
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '20', 10);

//     // Tính toán offset (số sản phẩm bỏ qua)
//     const offset = (page - 1) * limit;

//     // Lấy tổng số sản phẩm để tính tổng số trang
//     const totalProducts = await prisma.product.count();

//     // Truy vấn sản phẩm với pagination
//     const products = await prisma.product.findMany({
//       skip: offset,
//       take: limit,
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         price: true,
//         originalPrice: true,
//         image: true,
//         brand: true,
//         category: {
//           select: {
//             name: true,
//           },
//         },
//         gallery: true
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     const totalPages = Math.ceil(totalProducts / limit);

//     return NextResponse.json({
//       products,
//       pagination: {
//         totalProducts,
//         totalPages,
//         currentPage: page,
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error('[GET /api/admin/products] error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// File: src/app/api/admin/products/route.ts

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const searchTerm = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm và lọc chung cho cả hai truy vấn
    const whereClause: any = {};

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm.toLowerCase(),
        // Chú ý: `mode: 'insensitive'` đã bị xóa vì gây lỗi trên phiên bản Prisma
        // hiện tại của bạn. Tìm kiếm sẽ phân biệt chữ hoa, chữ thường.
      };
    }

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId, 10);
    }
    
    // Thêm điều kiện lọc theo status nếu có
    if (status && status !== 'All') { // 'All' là giá trị mặc định, không cần lọc
      whereClause.status = status;
    }
    
    // --- KHẮC PHỤC LỖI PRISMA VỚI `count()` ---
    // Sử dụng `findMany` với `select: { id: true }` để lấy tổng số sản phẩm
    // một cách an toàn và chính xác, tránh lỗi từ `count()`.
    const allMatchingProducts = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
      },
    });
    
    const totalProducts = allMatchingProducts.length;
    // ---------------------------------

    // Lấy danh sách sản phẩm cho trang hiện tại
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        category: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('[GET /api/products] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// // Helper function to upload a single file to Cloudinary
// const uploadFileToCloudinary = async (file: File): Promise<string> => {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   return new Promise<string>((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: 'ecommerce/products' },
//       (error, result) => {
//         if (error || !result) {
//           reject(error || new Error('Unknown Cloudinary upload error'));
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );
//     uploadStream.end(buffer);
//   });
// };

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Lấy dữ liệu từ formData
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const originalPrice = Number(formData.get('originalPrice'));
    const brand = formData.get('brand') as string;
    const categoryId = Number(formData.get('categoryId'));
    const description = formData.get('description') as string;
    const attributes = formData.get('attributes') as string;
    const thumbnailFile = formData.get('image') as File;
    // Lấy tất cả các file từ trường 'gallery'
    const galleryFiles: File[] = formData.getAll('gallery_files') as File[];

    console.log("galleryFiles::::", galleryFiles);

    if (!name || !price || !brand || !categoryId || !description || !thumbnailFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let parsedAttributes;
    try {
      parsedAttributes = JSON.parse(attributes);
      // Kiểm tra để đảm bảo dữ liệu là một đối tượng JSON hợp lệ
      if (typeof parsedAttributes !== 'object' || Array.isArray(parsedAttributes)) {
        throw new Error('Attributes must be a valid JSON object.');
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid attributes format. Must be a valid JSON object.' }, { status: 400 });
    }

    const thumbnailUrl: string = await uploadFileToCloudinary(thumbnailFile);

    const galleryUploadPromises = galleryFiles.map(file => uploadFileToCloudinary(file));
    const galleryUrls = await Promise.all(galleryUploadPromises);

    const allImages = [thumbnailUrl, ...galleryUrls];
    // Tải ảnh lên Cloudinary
    // const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // // Sử dụng Promise để đảm bảo quá trình upload hoàn tất và xử lý lỗi
    // const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    //     const uploadStream = cloudinary.uploader.upload_stream(
    //         { folder: 'ecommerce/products' },
    //         (error, result) => {
    //             if (error || !result) {
    //                 reject(error || new Error('Unknown Cloudinary upload error'));
    //             } else {
    //                 resolve(result);
    //             }
    //         }
    //     );
    //     uploadStream.end(buffer);
    // });

    // thumbnailUrl = uploadResult.secure_url;

    // Tạo slug từ tên sản phẩm
    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });

    const rating = 5; // ví dụ
    const reviews = 0; // ví dụ

    // Lưu sản phẩm vào database
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        image: thumbnailUrl,
        brand,
        gallery: allImages,
        rating,
        reviews,
        attributes: parsedAttributes,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[POST /api/products] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}