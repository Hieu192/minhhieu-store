import { notFound, redirect } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { Product } from '@/types/product';
import { Category } from '@/types/category';


export const revalidate = 3600;

interface Props {
  params: { slug: string; page?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

// ✨ THÊM HÀM generateStaticParams() để tạo trang tĩnh cho các danh mục
// export async function generateStaticParams() {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//   const res = await fetch(`${baseUrl}/api/categories/slug-list`); // Giả định bạn có API này

//   if (!res.ok) {
//     return [];
//   }
  
//   const data: { slugs: string[] } = await res.json();

//   if (!data || !Array.isArray(data.slugs)) {
//       return [];
//   }
//   const slugs = data.slugs;
//   const params = slugs.map((slug) => ({ slug }));
//   // const pagesToGenerate: { slug: string; page?: string[] }[] = [];

//   const additionalPages = slugs.flatMap((slug) => [
//     { slug, page: ['page', '2'] },
//     { slug, page: ['page', '3'] },
//   ]);
//   // Tạo đường dẫn cho trang chính của từng danh mục
//   // slugs.forEach((item) => {
//   //   pagesToGenerate.push({ slug: item });
//   //   // Tùy chọn: tạo thêm đường dẫn cho các trang con (ví dụ trang 2, 3)
//   //   // Để Next.js pre-render các trang phổ biến ngay từ đầu
//   //   // Bổ sung các trang con
//   //   pagesToGenerate.push({ slug: item, page: ['page', '2'] });
//   //   pagesToGenerate.push({ slug: item, page: ['page', '3'] });
//   // });

//   return [...params, ...additionalPages];
// }

// Generate metadata cho trang category
export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (params.slug === '.well-known') {
    return {};
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories/${params.slug}`, { next: { revalidate: 7200 } });

  if (!res.ok) {
    return {};
  }
  const category = await res.json();

  return {
    title: `${category.name} | Thiết bị vệ sinh chính hãng`,
    description: `Khám phá danh mục ${category.name} với các sản phẩm chất lượng cao, giá tốt nhất.`,
    openGraph: {
      title: `${category.name} | Thiết bị vệ sinh`,
      description: `Danh mục sản phẩm ${category.name} chất lượng, chính hãng.`,
      url: `${baseUrl}/${params.slug}`,
      images: [
        {
          url: category.image || '/default-og.jpg',
          width: 800,
          height: 600,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Thiết bị vệ sinh`,
      description: `Xem sản phẩm trong danh mục ${category.name}.`,
      images: [category.image || '/default-og.jpg'],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const limit = 10;

  // ✨ Thêm kiểm tra .well-known ở đây để tránh lỗi SSR
  if (params.slug === '.well-known') {
    return notFound();
  }

  // Lấy số trang từ URL hoặc mặc định là 1
  const page = params.page && params.page[1] ? parseInt(params.page[1]) : 1;
  const offset = (page - 1) * limit;

  // Chuyển hướng /danh-muc/page/1 về /danh-muc để tránh trùng lặp
  if (page === 1 && params.page) {
    const urlParams = new URLSearchParams(searchParams as Record<string, string>);
    const paramString = urlParams.toString();
    redirect(`/${params.slug}${paramString ? `?${paramString}` : ''}`);
  }

  try {
    const [catRes, subRes, breadcrumbRes, productsRes, countRes] = await Promise.all([
      fetch(`${baseUrl}/api/categories/${params.slug}`),
      fetch(`${baseUrl}/api/categories/${params.slug}/children`), 
      fetch(`${baseUrl}/api/categories/${params.slug}/breadcrumb`), 
      fetch(`${baseUrl}/api/categories/${params.slug}/products?limit=${limit}&offset=${offset}&sort=${searchParams.sort || ''}`),
      fetch(`${baseUrl}/api/products/count?category=${params.slug}`), 
    ]);

    if (!catRes.ok) return notFound();

    const category: Category = await catRes.json();
    const subcategories: Category[] = await subRes.json();
    const breadcrumb = await breadcrumbRes.json();
    const products: Product[] = await productsRes.json();
    const count = await countRes.json();
    const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort || 'name';

    return (
      <>
        {/* Breadcrumb Schema.org Markup cho SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumb.map((item: any, i: number) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.name,
                item: `${baseUrl}/${item.slug}`,
              })),
            }),
          }}
        />
        {/* Product List Schema.org Markup cho SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: products.map((product: Product, index: number) => ({
                "@type": "Product",
                position: index + 1,
                name: product.name,
                url: `${baseUrl}/products/${product.slug}`,
                image: product.image,
              })),
            }),
          }}
        />
        <CategoryPageClient
          slug={params.slug}
          category={category}
          subcategories={subcategories}
          breadcrumb={breadcrumb}
          products={products}
          totalProducts={count.count}
          page={page}
          sort={sortParam}
          searchParams={searchParams}
        />
      </>
    );
  } catch (err) {
    console.error('SSR error:', err);
    return notFound();
  }
}