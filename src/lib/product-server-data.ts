
import { prisma } from './prisma';

// Hàm để tạo params cho generateStaticParams của trang chi tiết sản phẩm
export async function getAllProductSlugsForDetailStatic(): Promise<{ productSlug: string }[]> {
  const allProducts = await prisma.product.findMany({
    select: {
      slug: true,
    },
  });

  return allProducts.map((product: {slug: string}) => ({
    productSlug: product.slug,
  }));
}