import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { deleteFileFromCloudinary, deleteFolderFromCloudinary, uploadFileToCloudinary } from '@/ultis/cloudinary';


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id, 10);
    
    // Kiểm tra xem ID có phải là số hợp lệ không
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Tìm sản phẩm trong cơ sở dữ liệu
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        originalPrice: true,
        image: true,
        gallery: true,
        rating: true,
        reviews: true,
        attributes: true,
        categoryId: true,
        brand: true,
      },
    });

    // Nếu không tìm thấy sản phẩm, trả về lỗi 404
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Trả về thông tin sản phẩm
    return NextResponse.json(product, { status: 200 });

  } catch (error) {
    console.error('[GET /api/products/[id]] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const formData = await req.formData();
    
    // Tìm sản phẩm hiện tại để lấy dữ liệu cũ
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Khởi tạo một đối tượng data chỉ chứa các trường cần cập nhật
    const updateData: any = {};

    // Lấy dữ liệu từ formData và chỉ thêm vào updateData nếu có giá trị
    const name = formData.get('name') as string;
    if (name) updateData.name = name;
    
    const price = Number(formData.get('price'));
    if (!isNaN(price)) updateData.price = price;

    const originalPrice = Number(formData.get('originalPrice'));
    if (!isNaN(originalPrice)) updateData.originalPrice = originalPrice;
    
    const brand = Number(formData.get('brand'));
    if (!isNaN(brand)) updateData.brandId = brand;
    
    const categoryId = Number(formData.get('categoryId'));
    if (!isNaN(categoryId)) updateData.categoryId = categoryId;
    
    const description = formData.get('description') as string;
    if (description) updateData.description = description;

    const rating = Number(formData.get('rating'));
    if (!isNaN(rating)) updateData.rating = rating;

    // Xử lý JSON attributes
    const attributesString = formData.get('attributes') as string;
    if (attributesString) {
      try {
        const newAttributes = JSON.parse(attributesString);
        if (typeof newAttributes !== 'object' || Array.isArray(newAttributes)) {
          return NextResponse.json({ error: 'Attributes must be a valid JSON object.' }, { status: 400 });
        }
        updateData.attributes = newAttributes;
      } catch (e) {
        return NextResponse.json({ error: 'Invalid attributes format. Must be a valid JSON object.' }, { status: 400 });
      }
    }
    
    // Xử lý upload ảnh thumbnail mới
    let newThumbnailUrl: string | null = null;
    const thumbnailFile = formData.get('image') as File | null;
    if (thumbnailFile && thumbnailFile.name) {
      newThumbnailUrl = await uploadFileToCloudinary(thumbnailFile, 'products', productId.toString());
      // 2. Cập nhật URL ảnh thumbnail mới vào updateData
      updateData.image = newThumbnailUrl;
    }
    
    // Xử lý upload ảnh gallery mới
    const newGalleryFiles = formData.getAll('gallery_files') as File[];
    const oldGalleryUrls = formData.getAll('gallery_urls') as string[];
    
    let allGalleryUrls: string[] = [];

    if (newThumbnailUrl) {
      // Thêm URL thumbnail mới vào đầu danh sách gallery và loại bỏ ảnh đầu tiên (nếu có)
      allGalleryUrls = [newThumbnailUrl, ...oldGalleryUrls.slice(1)];
    } else {
      // Nếu không có thumbnail mới, giữ nguyên danh sách cũ
      allGalleryUrls = oldGalleryUrls;
    }

    if (newGalleryFiles && newGalleryFiles.length > 0) {
      const uploadPromises = newGalleryFiles.map(file => uploadFileToCloudinary(file, 'products', productId.toString()));
      const uploadedUrls = await Promise.all(uploadPromises);
      allGalleryUrls = [...oldGalleryUrls, ...uploadedUrls];
    }
    
    updateData.gallery = allGalleryUrls;
    
    // Cập nhật slug nếu tên sản phẩm thay đổi
    if (updateData.name && updateData.name !== existingProduct.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true, locale: 'vi' });
    }

    // Cập nhật sản phẩm trong database chỉ với các trường trong updateData
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('[PATCH /api/products/[id]] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id, 10);

    // Kiểm tra xem ID có phải là số hợp lệ không
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Tìm sản phẩm trong cơ sở dữ liệu để lấy danh sách ảnh cần xóa
    const productToDelete = await prisma.product.findUnique({
      where: { id: productId },
    });

    // Nếu không tìm thấy sản phẩm, trả về lỗi 404
    if (!productToDelete) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    } 

    // Lấy URL ảnh thumbnail và gallery
    // const imageUrlsToDelete = new Set<string>();
    // if (productToDelete.image) {
    //   imageUrlsToDelete.add(productToDelete.image);
    // }
    // if (productToDelete.gallery && Array.isArray(productToDelete.gallery) && productToDelete.gallery.length > 0) {
    //   // Bỏ gán kiểu (url: string)
    //   productToDelete.gallery.forEach((url) => { 
    //     // Kiểm tra xem url có phải là string không trước khi thêm vào Set
    //     if (typeof url === 'string') {
    //       imageUrlsToDelete.add(url);
    //     }
    //   });
    // }

    // // Chuyển Set về mảng để sử dụng với Promise.all
    // const urlsToDeleteArray = Array.from(imageUrlsToDelete);

    await deleteFolderFromCloudinary('products', productId.toString());

    // Xóa sản phẩm khỏi cơ sở dữ liệu
    await prisma.product.delete({
      where: { id: productId },
    });

    // Xóa tất cả các ảnh liên quan khỏi Cloudinary
    // if (urlsToDeleteArray.length > 0) {
    //   try {
    //     await Promise.all(
    //       urlsToDeleteArray.map(url => deleteFileFromCloudinary(url, 'products'))
    //     );
    //   } catch (cloudinaryError) {
    //     // Log lỗi nhưng không chặn việc xóa sản phẩm thành công
    //     console.error('Failed to delete images from Cloudinary:', cloudinaryError);
    //   }
    // }
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('[DELETE /api/products/[id]] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}