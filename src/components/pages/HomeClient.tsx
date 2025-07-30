// components/pages/HomeClient.tsx
'use client';

import { useCart } from '@/context/Cartcontext';
import ProductCard from '@/components/product/ProductCard';
// import HomeCategorySliders from './HomePageCategorySlider';
import Link from 'next/link';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import Image from 'next/image';
import SafeImage from '@/ultis/SafeImage';
import { capitalizeWords } from '@/ultis/helps';
import HeadingWithLine from '../ui/HeadingWithLine';

interface Props {
  categories: Category[];
  featuredProducts: Product[];
}

export default function HomeClient({ categories, featuredProducts }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Thiết bị xây dựng chất lượng cao
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Khám phá bộ sưu tập thiết bị vệ sinh, gạch men, và thiết bị bếp từ các thương hiệu hàng đầu
            </p>
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <HeadingWithLine>
            Danh mục sản phẩm
          </HeadingWithLine>

          {/* 👇 Mobile horizontal scroll (<=640px) */}

          {/* 👇 Grid layout for tablet/desktop (>=640px) */}
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-8 auto-rows-auto overflow-hidden">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="bg-white relative border border-gray-100 hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] hover:border-gray-200 hover:z-10 transition-all"
              >
                <SafeImage
                  src={category.image || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="rounded-full object-cover w-16 h-16 md:w-24 md:h-24 mx-auto mt-4"
                />
                <div className="text-center mt-2 mb-4 mx-2">
                  <h4 className="text-xs font-semibold">{capitalizeWords(category.name)}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-4 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingWithLine>
            Sản phẩm nổi bật
          </HeadingWithLine>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Slider theo từng danh mục */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Khám phá theo danh mục</h2>
          <HomeCategorySliders />
        </div>
      </section> */}
    </div>
  );
}
