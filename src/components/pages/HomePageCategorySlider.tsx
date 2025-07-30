// 'use client';

// import { useRef, useEffect, useState } from 'react';
// // import { categories } from '@/data/categories';
// import { products } from '@/data/products';
// import ProductCard from '@/components/product/ProductCard';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useCart } from '@/context/Cartcontext';


// export default function HomeCategorySliders() {

//   const [categories, setCategories] = useState([]);
//   const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});

//   useEffect(() => {
//     fetch('/api/categories')
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data);
//         data.forEach((cat) => {
//           fetch(`/api/products/category/${cat.slug}`)
//             .then((res) => res.json())
//             .then((products) => {
//               setProductsByCategory((prev) => ({ ...prev, [cat.slug]: products }));
//             });
//         });
//       });
//   }, []);
//   return (
//     <section className="space-y-16 py-8">
//       {categories.map((category) => {
//         const filtered = productsByCategory[category.slug] || [];
//         if (filtered.length === 0) return null;

//         return (
//           <CategorySlider
//             key={category.id}
//             title={category.name}
//             slug={category.slug}
//             products={filtered}
//           />
//         );
//       })}
//     </section>
//   );
// }

// function CategorySlider({
//   title,
//   slug,
//   products,
// }: {
//   title: string;
//   slug: string;
//   products: typeof products;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { addToCart } = useCart();
//   const [isHovered, setIsHovered] = useState(false);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Auto scroll
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const scrollFunc = () => {
//       if (!container || isHovered) return;

//       const items = container.querySelectorAll('.product-slide-item');
//       if (!items.length) return;

//       const item = items[0] as HTMLElement;
//       const styleparent = window.getComputedStyle(item.parentElement || item);
//       const gap = parseFloat(styleparent.gap || '16');
//       const scrollAmount = item.clientWidth + gap;

//       const maxScrollLeft = container.scrollWidth - container.clientWidth;
//       const nextScrollLeft = container.scrollLeft + scrollAmount;

//       if (nextScrollLeft >= maxScrollLeft + 1) {
//         container.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     };

//     // Khởi tạo interval
//     const interval = setInterval(scrollFunc, 5000);
//     intervalRef.current = interval;

//     return () => clearInterval(interval);
//   }, [isHovered]);

//   const startAutoScroll = () => {
//     if (!containerRef.current) return;

//     const container = containerRef.current;

//     const updateScroll = () => {
//       const items = container.querySelectorAll('.product-slide-item');
//       if (!items.length || isHovered) return;

//       const item = items[0] as HTMLElement;
//       const styleparent = window.getComputedStyle(item.parentElement || item);
//       const gap = parseFloat(styleparent.gap || '16');
//       const scrollAmount = item.clientWidth + gap;

//       const maxScrollLeft = container.scrollWidth - container.clientWidth;
//       const nextScrollLeft = container.scrollLeft + scrollAmount;

//       if (nextScrollLeft >= maxScrollLeft + 1) {
//         container.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     };

//     // Clear interval nếu có
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(updateScroll, 5000);
//   };

//   const resetAutoScroll = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);

//     const container = containerRef.current;
//     if (!container) return;

//     const scrollFunc = () => {
//       if (!container || isHovered) return;

//       const items = container.querySelectorAll('.product-slide-item');
//       if (!items.length) return;

//       const item = items[0] as HTMLElement;
//       const styleparent = window.getComputedStyle(item.parentElement || item);
//       const gap = parseFloat(styleparent.gap || '16');
//       const scrollAmount = item.clientWidth + gap;

//       const maxScrollLeft = container.scrollWidth - container.clientWidth;
//       const nextScrollLeft = container.scrollLeft + scrollAmount;

//       if (nextScrollLeft >= maxScrollLeft + 1) {
//         container.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     };

//     // Reset interval
//     const newInterval = setInterval(scrollFunc, 5000);
//     intervalRef.current = newInterval;
//   };

//   const scroll = (direction: 'left' | 'right') => {
//     const container = containerRef.current;
//     if (!container) return;

//     const items = container.querySelectorAll('.product-slide-item');
//     if (!items.length) return;

//     const item = items[0] as HTMLElement;
//     const styleparent = window.getComputedStyle(item.parentElement || item);
//     const gap = parseFloat(styleparent.gap || '16');
//     const scrollAmount = item.clientWidth + gap;

//     container.scrollBy({
//       left: direction === 'left' ? -scrollAmount : scrollAmount,
//       behavior: 'smooth',
//     });

//     resetAutoScroll(); // 🟢 Bắt đầu lại auto scroll
//   };

//   useEffect(() => {
//     resetAutoScroll();
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isHovered]);

//   return (
//     <div>
//       <div className="flex justify-between items-center px-4 mb-4">
//         <h2 className="text-xl font-bold">{title}</h2>
//         <Link
//           href={`/categories/${slug}`}
//           className="text-blue-600 text-sm hover:underline"
//         >
//           Xem tất cả
//         </Link>
//       </div>

//       <div className="relative">
//         {/* Nút điều hướng */}
//         <button
//           onClick={() => scroll('left')}
//           className="flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white p-2 shadow rounded-full z-10 opacity-90"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>

//         <button
//           onClick={() => scroll('right')}
//           className="flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white p-2 shadow rounded-full z-10 opacity-90"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>


//         {/* Danh sách sản phẩm */}
//         <div
//           ref={containerRef}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           className="overflow-x-auto no-scrollbar scroll-smooth"
//         >
//           <div className="flex gap-4 min-w-max ml-0 pl-0">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="product-slide-item w-[calc(100vw/2.3)] sm:w-[calc(100vw/7.4)] max-w-sm flex-shrink-0"
//               >
//                 <ProductCard product={product} onAddToCart={addToCart} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
