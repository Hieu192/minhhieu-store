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
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            originalPrice: true,
            stock: true,
            attributes: true,
          },
        },
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

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updateData: any = {};

    const name = formData.get('name') as string;
    if (name) updateData.name = name;

    const description = formData.get('description') as string;
    if (description) updateData.description = description;

    const brand = Number(formData.get('brand'));
    if (!isNaN(brand)) updateData.brandId = brand;

    const categoryId = Number(formData.get('categoryId'));
    if (!isNaN(categoryId)) updateData.categoryId = categoryId;

    // attributes
    const attributesString = formData.get('attributes') as string;
    if (attributesString) {
      try {
        updateData.attributes = JSON.parse(attributesString);
      } catch {
        return NextResponse.json({ error: 'Invalid attributes JSON' }, { status: 400 });
      }
    }

    // Variants
    const variantsString = formData.get('variants') as string;
    if (variantsString) {
      let newVariants: any[];
      try {
        newVariants = JSON.parse(variantsString);
      } catch {
        return NextResponse.json({ error: 'Invalid variants JSON' }, { status: 400 });
      }

      const existingVariantIds = existingProduct.variants.map((v) => v.id);
      const incomingVariantIds = newVariants.map((v) => v.id).filter(Boolean);

      // Xoá các variant cũ không còn trong payload
      const variantsToDelete = existingVariantIds.filter(
        (id) => !incomingVariantIds.includes(id)
      );
      if (variantsToDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: { id: { in: variantsToDelete }, productId },
        });
      }

      // Thêm mới / cập nhật
      for (const variant of newVariants) {
        if (variant.id) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name,
              price: variant.price,
              originalPrice: variant.originalPrice,
              stock: variant.stock,
              attributes: variant.attributes || {},
            },
          });
        } else {
          await prisma.productVariant.create({
            data: {
              name: variant.name,
              price: variant.price,
              originalPrice: variant.originalPrice,
              stock: variant.stock,
              attributes: variant.attributes || {},
              productId,
            },
          });
        }
      }

      // Sau khi cập nhật variants → cập nhật lại giá product
      const updatedVariants = await prisma.productVariant.findMany({
        where: { productId },
      });

      if (updatedVariants.length > 0) {
        // Có biến thể → lấy variant rẻ nhất
        const cheapestVariant = updatedVariants.reduce((min, v) =>
          (v.price ?? Infinity) < (min.price ?? Infinity) ? v : min
        );
        updateData.price = cheapestVariant.price ?? 0;
        updateData.originalPrice = cheapestVariant.originalPrice ?? 0;
      } else {
        // Không có biến thể → dùng giá product từ form
        const productPrice = Number(formData.get('price'));
        const productOriginalPrice = Number(formData.get('originalPrice'));

        if (!isNaN(productPrice)) updateData.price = productPrice;
        if (!isNaN(productOriginalPrice)) updateData.originalPrice = productOriginalPrice;
      }
    }

    // slug
    if (updateData.name && updateData.name !== existingProduct.name) {
      updateData.slug = slugify(updateData.name, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
    }

    // TODO: xử lý upload ảnh thumbnail + gallery nếu cần
    // Xử lý upload ảnh thumbnail mới
    let newThumbnailUrl: string | null = null;
    const thumbnailFile = formData.get('image') as File | null;
    if (thumbnailFile && thumbnailFile.name) {
      newThumbnailUrl = await uploadFileToCloudinary(thumbnailFile, 'products', productId.toString());
      // 2. Cập nhật URL ảnh thumbnail mới vào updateData
      updateData.image = newThumbnailUrl;
      if (existingProduct.image) {
        await deleteFileFromCloudinary(existingProduct.image);
      }
    } else if (formData.get('image_url')) {
      // Trường hợp giữ nguyên thumbnail cũ
      updateData.image = formData.get('image_url') as string;
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

    // Xoá những ảnh gallery bị remove (có trong DB nhưng không còn trong oldGalleryUrls)
    const existingGallery = (existingProduct.gallery as string[]) || [];
    const removedGalleryUrls = existingGallery.filter(
      (url: string) => !oldGalleryUrls.includes(url)
    );

    for (const removedUrl of removedGalleryUrls) {
      await deleteFileFromCloudinary(removedUrl);
    }
    
    updateData.gallery = allGalleryUrls;
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { variants: true },
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
      include: { variants: true },
    });

    // Nếu không tìm thấy sản phẩm, trả về lỗi 404
    if (!productToDelete) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    } 

    await deleteFolderFromCloudinary('products', productId.toString());

    if (productToDelete.variants.length > 0) {
      await prisma.productVariant.deleteMany({
        where: { productId },
      });
    }
    
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