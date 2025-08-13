import HomeClient from '@/components/pages/HomeClient';
import HomeCategorySliders from '@/components/pages/HomeCategorySliders.server';
import { getCategories, getCategoriesTree, getFeaturedProducts } from '@/lib/api';
import HeadingWithLine from '@/components/ui/HeadingWithLine';

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const categoriesTree = await getCategoriesTree();

  return (
    <>
      <HomeClient categories={categories} featuredProducts={featuredProducts} />
      
      {/* 👇 Move HomeCategorySliders ra đây (server side) */}
      <section className="py-4 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingWithLine>
            Khám phá theo danh mục
          </HeadingWithLine>
          <HomeCategorySliders categoriesTree={categoriesTree} categories={categories} />
        </div>
      </section>
    </>
  );
}
