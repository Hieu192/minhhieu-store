// app/page.tsx hoặc app/home/page.tsx

import HomeClient from '@/components/pages/HomeClient';
import HomeCategorySliders from '@/components/pages/HomeCategorySliders.server';
import { getCategories, getFeaturedProducts } from '@/lib/api';

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HomeClient categories={categories} featuredProducts={featuredProducts} />
      
      {/* Đặt component Server riêng ở đây */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Khám phá theo danh mục 2
          </h2>
          <HomeCategorySliders />
        </div>
      </section>
    </>
  );
}
