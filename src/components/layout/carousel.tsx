'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';

export default function HeroCarousel() {
  const slides = [
    {
      title: 'Thiết bị xây dựng chất lượng cao',
      description: 'Khám phá bộ sưu tập thiết bị vệ sinh, gạch men, và thiết bị bếp từ các thương hiệu hàng đầu',
      link: '/products',
      bg: 'bg-gradient-to-r from-blue-600 to-blue-800'
    },
    {
      title: 'Giảm giá 30% thiết bị bếp',
      description: 'Cơ hội sở hữu bếp từ, lò nướng, máy hút mùi với giá siêu ưu đãi',
      link: '/products?category=bep',
      bg: 'bg-gradient-to-r from-red-600 to-red-800'
    },
    {
      title: 'Sản phẩm mới nhất 2025',
      description: 'Bộ sưu tập xu hướng mới nhất cho ngôi nhà hiện đại',
      link: '/products?sort=newest',
      bg: 'bg-gradient-to-r from-green-600 to-green-800'
    }
  ];

  return (
<Swiper
  modules={[Autoplay, Pagination, Navigation]}
  autoplay={{ delay: 4000, disableOnInteraction: false }}
  pagination={{ clickable: true }}
  navigation
  loop
  slidesPerView={1} // 👈 Chỉ hiển thị 1 slide tại 1 thời điểm
  className="w-full h-[500px]"
>
  {slides.map((slide, idx) => (
    <SwiperSlide key={idx} className="!h-full"> {/* 👈 Chiều cao full */}
      <section className={`${slide.bg} text-white h-full flex items-center justify-center`}>
        <div className="max-w-4xl text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{slide.title}</h1>
          <p className="text-xl mb-8 text-white/80">{slide.description}</p>
          <Link
            href={slide.link}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Khám phá ngay
          </Link>
        </div>
      </section>
    </SwiperSlide>
  ))}
</Swiper>
  );
}
