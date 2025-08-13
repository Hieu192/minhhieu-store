'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Product } from '@/types/product';
import ProductCard from '../product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { capitalizeWords } from '@/ultis/helps';

interface Props {
  title: string;
  slug: string;
  products: Product[];
  subCategories?: { name: string; slug: string }[];
}

export default function CategorySlider({ title, slug, products, subCategories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimating = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const hasDragged = useRef(false);

  // Tính kích thước một bước cuộn
  const scrollByAmount = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return 0;
    const firstItem = container.querySelector('.product-slide-item') as HTMLElement;
    if (!firstItem) return 0;

    const style = window.getComputedStyle(firstItem.parentElement || firstItem);
    const gap = parseFloat(style.gap || '16');
    return firstItem.offsetWidth + gap;
  }, []);

  // Cuộn bằng nút
  const scrollTo = useCallback((dir: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container || isAnimating.current) return;

    const amount = scrollByAmount();
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const nextTarget =
      dir === 'right' ? container.scrollLeft + amount : container.scrollLeft - amount;

    const isResettingToStart = nextTarget > maxScrollLeft - 5;
    const isResettingToEnd = nextTarget < 0;
    const resetDuration = 800;
    const normalDuration = 400;
    const scrollDuration = isResettingToStart || isResettingToEnd ? resetDuration : normalDuration;

    isAnimating.current = true;

    if (isResettingToStart) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (isResettingToEnd) {
      container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: nextTarget, behavior: 'smooth' });
    }

    setTimeout(() => {
      isAnimating.current = false;
    }, scrollDuration);
  }, [scrollByAmount]);

  // Auto scroll
  const autoScroll = useCallback(() => {
    if (isHovered || isAnimating.current) return;
    scrollTo('right');
  }, [isHovered, scrollTo]);

  useEffect(() => {
    intervalRef.current = setInterval(autoScroll, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoScroll]);

  const resetAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(autoScroll, 4000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;

    // Tắt smooth khi kéo
    scrollRef.current.style.scrollBehavior = 'auto';

    startX.current = e.pageX;
    scrollStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    hasDragged.current = true;

    const walk = e.pageX - startX.current; // khoảng kéo
    scrollRef.current.scrollLeft = scrollStart.current - walk;
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;

    // Bật lại smooth khi snap
    scrollRef.current.style.scrollBehavior = 'smooth';

    const container = scrollRef.current;
    const amount = scrollByAmount();
    const nearestIndex = Math.round(container.scrollLeft / amount);
    const target = nearestIndex * amount;
    container.scrollTo({ left: target, behavior: 'smooth' });
  };

  const handleMouseLeave = () => {
    if (isDragging.current) handleMouseUp();
  };

  // Chặn click khi vừa kéo
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  };

  return (
    <div className="relative sm:py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-3 gap-2">
        {/* Title + Xem tất cả */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">{title.toUpperCase()}</h2>
          {/* Chỉ hiện trên mobile */}
          <Link
            href={`/${slug}`}
            className="flex md:hidden items-center text-sm text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-200 ease-in-out border border-blue-600 py-2 px-3 rounded-lg"
          >
            <span>Xem tất cả</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Subcategories scrollable trên mobile, flex wrap trên PC */}
        <div className="flex overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal gap-2 no-scrollbar">
          {subCategories?.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${sub.slug}`}
              className="flex items-center text-sm md:text-base text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-200 ease-in-out border border-blue-600 py-2 px-3 md:px-4 rounded-lg flex-shrink-0"
            >
              {capitalizeWords(sub.name)}
            </Link>
          ))}
          {/* Chỉ hiện trên PC */}
          <Link
            href={`/${slug}`}
            className="hidden md:flex items-center text-sm md:text-base text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-200 ease-in-out border border-blue-600 py-1 px-3 md:px-4 rounded-lg"
          >
            <span>Xem tất cả</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Nút trái */}
        <button
          onClick={() => {
            scrollTo('left');
            resetAutoScroll();
          }}
          disabled={isAnimating.current}
          className={`absolute z-20 left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow transition  ${
            isAnimating.current ? 'bg-gray-300 cursor-not-allowed' : 'bg-white/80 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft />
        </button>

        {/* Danh sách sản phẩm */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseLeave();
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClickCapture={handleClickCapture}
          className="flex overflow-x-auto overflow-y-visible scroll-smooth gap-4 no-scrollbar z-0 pt-3 pb-6 select-none cursor-grab active:cursor-grabbing"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-slide-item relative z-10 w-[calc((100%_-_1rem)/2)] sm:w-[calc((100%_-_3rem)/4)] max-w-sm flex-shrink-0"
            >
              <ProductCard product={product} hasDraggedRef={hasDragged}/>
            </div>
          ))}
        </div>

        {/* Nút phải */}
        <button
          onClick={() => {
            scrollTo('right');
            resetAutoScroll();
          }}
          disabled={isAnimating.current}
          className={`absolute z-20 right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow transition ${
            isAnimating.current ? 'bg-gray-300 cursor-not-allowed' : 'bg-white/80 hover:hover:bg-gray-200'
          }`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
