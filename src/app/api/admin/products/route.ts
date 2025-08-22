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


// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     // Lấy dữ liệu từ formData
//     const name = formData.get('name') as string;
//     const price = Number(formData.get('price'));
//     const originalPrice = Number(formData.get('originalPrice'));
//     const brand = formData.get('brand') as string;
//     const categoryId = Number(formData.get('categoryId'));
//     const description = formData.get('description') as string;
//     const attributes = formData.get('attributes') as string;
//     const thumbnailFile = formData.get('image') as File;
//     // Lấy tất cả các file từ trường 'gallery'
//     const galleryFiles: File[] = formData.getAll('gallery_files') as File[];


//     if (!name || !price || !brand || !categoryId || !description || !thumbnailFile) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     let parsedAttributes;
//     try {
//       parsedAttributes = JSON.parse(attributes);
//       // Kiểm tra để đảm bảo dữ liệu là một đối tượng JSON hợp lệ
//       if (typeof parsedAttributes !== 'object' || Array.isArray(parsedAttributes)) {
//         throw new Error('Attributes must be a valid JSON object.');
//       }
//     } catch (e) {
//       return NextResponse.json({ error: 'Invalid attributes format. Must be a valid JSON object.' }, { status: 400 });
//     }

//     // 1. Tạo slug và lưu sản phẩm vào database trước để có ID
//     const slug = slugify(name, {
//       lower: true,
//       strict: true,
//       locale: 'vi',
//     });

//     // Các trường ảnh tạm thời để tránh lỗi "not found"
//     const tempImage = "placeholder_image_url"; 
//     const tempGallery: string[] = [];

//     const product = await prisma.product.create({
//       data: {
//         name,
//         slug,
//         description,
//         price,
//         originalPrice,
//         image: tempImage, // Gán ảnh tạm thời
//         brand,
//         gallery: tempGallery, // Gán mảng ảnh tạm thời
//         rating: 5,
//         reviews: 0,
//         attributes: parsedAttributes,
//         categoryId,
//       },
//     });

//     // Lấy ID của sản phẩm vừa được tạo
//     const productId = product.id;

//     const thumbnailUrl: string = await uploadFileToCloudinary(thumbnailFile, 'products', productId.toString());

//     const galleryUploadPromises = galleryFiles.map(file => uploadFileToCloudinary(file, 'products', productId.toString()));
//     const galleryUrls = await Promise.all(galleryUploadPromises);

//     const allImages = [thumbnailUrl, ...galleryUrls];

//     const updatedProduct = await prisma.product.update({
//       where: { id: productId },
//       data: {
//         image: thumbnailUrl,
//         gallery: allImages,
//       },
//     });

//     // thumbnailUrl = uploadResult.secure_url;

//     // Tạo slug từ tên sản phẩm
//     // const slug = slugify(name, {
//     //   lower: true,
//     //   strict: true,
//     //   locale: 'vi',
//     // });


//     // Lưu sản phẩm vào database
//     // const product = await prisma.product.create({
//     //   data: {
//     //     name,
//     //     slug,
//     //     description,
//     //     price,
//     //     originalPrice,
//     //     image: thumbnailUrl,
//     //     brand,
//     //     gallery: allImages,
//     //     rating,
//     //     reviews,
//     //     attributes: parsedAttributes,
//     //     categoryId,
//     //   },
//     // });

//     return NextResponse.json(updatedProduct, { status: 201 });
//   } catch (error) {
//     console.error('[POST /api/products] error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

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
    const variants = formData.get('variants') as string; // JSON string
    const thumbnailFile = formData.get('image') as File;
    const galleryFiles: File[] = formData.getAll('gallery_files') as File[];

    if (!name || !brand || !categoryId || !description || !thumbnailFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse attributes
    let parsedAttributes: Record<string, any> = {};
    try {
      parsedAttributes = attributes ? JSON.parse(attributes) : {};
    } catch {
      return NextResponse.json({ error: 'Invalid attributes format. Must be JSON.' }, { status: 400 });
    }

    // Parse variants
    let parsedVariants: any[] = [];
    try {
      parsedVariants = variants ? JSON.parse(variants) : [];
      if (!Array.isArray(parsedVariants)) throw new Error('Variants must be array');
    } catch {
      return NextResponse.json({ error: 'Invalid variants format. Must be JSON array.' }, { status: 400 });
    }

    // Xác định giá cho product
    let finalPrice = price;
    let finalOriginalPrice = originalPrice;

    if (parsedVariants.length > 0) {
      // Nếu có variants thì lấy giá thấp nhất
      finalPrice = Math.min(...parsedVariants.map(v => Number(v.price)));
      finalOriginalPrice = Math.min(...parsedVariants.map(v => Number(v.originalPrice)));
    }

    // Tạo slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });

    // Tạo product ban đầu (ảnh tạm)
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        image: 'placeholder_image_url',
        brand,
        gallery: [],
        rating: 5,
        reviews: 0,
        attributes: parsedAttributes,
        categoryId,
      },
    });

    const productId = product.id;

    // Upload ảnh
    const thumbnailUrl = await uploadFileToCloudinary(thumbnailFile, 'products', productId.toString());
    const galleryUrls = await Promise.all(
      galleryFiles.map(file => uploadFileToCloudinary(file, 'products', productId.toString()))
    );

    const allImages = [thumbnailUrl, ...galleryUrls];

    // Nếu có variants thì lưu vào bảng Variant
    if (parsedVariants.length > 0) {
      await prisma.productVariant.createMany({
        data: parsedVariants.map(v => ({
          name: v.name,
          price: Number(v.price),
          originalPrice: Number(v.originalPrice),
          attributes: v.attributes || {},
          productId,
        })),
      });
    }

    // Cập nhật lại product với ảnh thật
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        image: thumbnailUrl,
        gallery: allImages,
      },
      include: {
        variants: true, // trả luôn variants nếu có
      },
    });

    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error) {
    console.error('[POST /api/products] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
