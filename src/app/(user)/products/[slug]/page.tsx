// ✅ app/products/[slug]/page.tsx
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types/product';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Export biến revalidate để thiết lập thời gian caching
// Giá trị 3600 giây 221 giờ) có nghĩa là dữ liệu sẽ được cache trong 2 giờ
// Sau 1 giờ, dữ liệu sẽ được làm mới khi có yêu cầu tiếp theo
export const revalidate = 3600;

// Hàm này được Next.js chạy trong quá trình build để tạo ra các trang tĩnh
export async function generateStaticParams() {
  // Sử dụng Prisma trực tiếp để lấy danh sách slug
  const products = await prisma.product.findMany({
    select: {
      slug: true,
    },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Hàm này cũng chạy trong quá trình build, vì vậy cần sử dụng Prisma
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const baseUrl = "https://yourdomain.com";
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    // Nếu không tìm thấy sản phẩm, trả về metadata mặc định
    // hoặc sử dụng notFound() để hiển thị trang 404
    return {};
  }

  const description = product.description?.slice(0, 150) || "Sản phẩm chất lượng cao, bảo hành dài hạn.";

 let image: string | undefined = undefined;
  if (Array.isArray(product.gallery) && product.gallery.length > 0) {
    image = String(product.gallery[0]);
  } else if (product.image) {
    image = String(product.image);
  }

  const canonicalUrl = `${baseUrl}/products/${params.slug}`;

  return {
    title: `${product.name} | Thiết bị vệ sinh Minh Hiếu`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.name,
      description,
      url: canonicalUrl,
      type: "website", // ✅ fix: dùng website thay vì product
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

// Hàm này cũng chạy trong quá trình build, do đó chúng ta dùng Prisma thay vì fetch
export default async function Page({ params }: { params: { slug: string } }) {
  // Lấy dữ liệu sản phẩm trực tiếp từ cơ sở dữ liệu
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    // Dùng `include` để lấy đầy đủ dữ liệu category liên quan
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
          parentId: true,
          image: true,
          level: true,
          description: true,
        },
      },
      variants: true, 
    },
  });

  if (!product) {
    notFound();
  }

  // Tạo breadcrumb từ dữ liệu category
  const breadcrumb = [];
  // Khai báo kiểu dữ liệu của currentCategory để chấp nhận cả null
  let currentCategory: typeof product.category | null = product.category;

  // Lặp để lấy tất cả các cấp cha của category
  while (currentCategory) {
    breadcrumb.unshift({
      name: currentCategory.name,
      slug: currentCategory.slug,
    });
    // Tìm category cha
    if (currentCategory.parentId) {
      // Chỉ định rõ ràng kiểu dữ liệu cho parentCategory
      // Đồng bộ hóa các trường select để khớp với kiểu của product.category
      const parentCategory: typeof product.category | null = await prisma.category.findUnique({
        where: { id: currentCategory.parentId },
        select: {
          id: true,
          slug: true,
          name: true,
          parentId: true,
          image: true,
          level: true,
          description: true,
        },
      });
      currentCategory = parentCategory; // Gán kết quả truy vấn, có thể là null
    } else {
      currentCategory = null;
    }
  }

  // Ép kiểu `product` một cách an toàn
  const clientProduct: Product = {
    ...product,
    originalPrice: product.originalPrice ?? undefined,
    description: product.description ?? '',
    // Chuyển đổi 'badges' từ kiểu JsonValue sang mảng string nếu có
    badges: (product.badges as string[] | null) ?? [],
    // Chuyển đổi 'attributes' từ kiểu JsonValue sang Record<string, string>
    // Nếu giá trị là null hoặc không phải object, sẽ trả về một object rỗng
    attributes: (product.attributes && typeof product.attributes === 'object') ? product.attributes as Record<string, string> : {},
    // Chuyển đổi 'gallery' từ kiểu JsonValue sang mảng string nếu có
    gallery: (product.gallery as string[] | null) ?? [],
    variants: product.variants.map((v) => ({
    id: v.id,
    name: v.name ?? '',
    image: v.image ?? '',
    price: v.price,
    originalPrice: v.originalPrice ?? undefined,
    stock: v.stock,
    attributes:
      v.attributes && typeof v.attributes === 'object'
        ? (v.attributes as Record<string, string>)
        : {},
  })),
  };

  return <ProductDetailClient product={clientProduct} breadcrumb={breadcrumb} />;
}
