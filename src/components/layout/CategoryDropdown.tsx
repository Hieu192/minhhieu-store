'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// import { categories } from '@/data/categories';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import Image from 'next/image';
import SafeImage from '@/ultis/SafeImage';

export default function CategoryDropdown({ categories }: { categories: { id: number; name: string; slug: string }[] }) {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(categories[0]?.name || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cached = useRef<Record<string, { hot: any[]; best: any[] }>>({});
  const [hotProducts, setHotProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (!hoveredCategory) return;

    const slug = categories.find((c) => c.name === hoveredCategory)?.slug;
    if (!slug) return;

    const cachedData = cached.current[hoveredCategory];
    if (cachedData) {
      setHotProducts(cachedData.hot);
      setBestSellers(cachedData.best);
      return;
    }

    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const [hotRes, bestRes] = await Promise.all([
          fetch(`/api/categories/${slug}/products?sort=rating&limit=4`, { next: { revalidate: 60 } }),
          fetch(`/api/categories/${slug}/products?sort=reviews&limit=4`, { next: { revalidate: 60 } }),
        ]);

        if (!hotRes.ok || !bestRes.ok) throw new Error('Failed to fetch');

        const hotData = await hotRes.json();
        const bestData = await bestRes.json();

        cached.current[hoveredCategory] = { hot: hotData, best: bestData };
        setHotProducts(hotData);
        setBestSellers(bestData);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setHotProducts([]);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [hoveredCategory, categories]);

  const handleProductClick = () => {
    setIsDropdownOpen(false);
    router.push(`/products`);
  };

  const handleCategoryClick = (slug: string) => {
    setIsDropdownOpen(false);
    router.push(`/products?category=${slug}`);
  };

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isDropdownOpen) {
      document.body.classList.add('overflow-hidden');
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      document.body.style.paddingRight = '';
    };
  }, [isDropdownOpen]);

  return (
    <div
      className="relative group z-100"
      // onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseEnter={() => {
          if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            hoverTimeout.current = setTimeout(() => {
              setIsDropdownOpen(true);
            }, 100);
          }}
      // onMouseLeave={() => setIsDropdownOpen(false)}
      onMouseLeave={() => {
          if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
          setIsDropdownOpen(false);
        }}
    >
      <div className="flex items-center text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
        <div onClick={() => handleProductClick()}>SẢN PHẨM</div>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full mt-0 z-50 w-screen max-w-7xl translate-x-[-11%]">
          <div className="bg-white shadow-lg border rounded-lg flex h-[420px] w-full max-w-7xl overflow-hidden px-4">
            <div className="w-1/4 overflow-y-auto border-r p-4 space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onMouseEnter={() => {
                    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                    hoverTimeout.current = setTimeout(() => {
                      setHoveredCategory(cat.name);
                    }, 100);
                  }}
                  onMouseLeave={() => {
                    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                  }}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex items-center justify-between cursor-pointer px-4 py-3 rounded hover:bg-gray-100 transition-colors text-sm font-medium ${
                    hoveredCategory === cat.name ? 'bg-gray-100 text-blue-600' : ''
                  }`}
                >
                  <span>{cat.name.toUpperCase()}</span>

                  {hoveredCategory === cat.name && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}

            </div>

            <div className="w-3/4 overflow-y-auto p-4 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm nổi bật</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {loading && hotProducts.length === 0 ? (
                    <LoadingCards />
                  ) : (
                    hotProducts.map((p) => <ProductMiniCard key={p.id} product={p} onClick={() => setIsDropdownOpen(false)}/>)
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm bán chạy</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {loading && bestSellers.length === 0 ? (
                    <LoadingCards />
                  ) : (
                    bestSellers.map((p) => <ProductMiniCard key={p.id} product={p} onClick={() => setIsDropdownOpen(false)}/>)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  product: Product;
  onClick: () => void; // hoặc (product: Product) => void nếu cần truyền product khi click
}

function ProductMiniCard({ product, onClick }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onClick}
      className="border rounded-lg hover:shadow hover:bg-gray-50 transition block"
    >
      {/* <img
        src='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'
        alt={product.name}
        className="w-full h-32 object-cover rounded mb-2"
      /> */}
      <SafeImage
        src={product.image}
        alt={product.name}
        width={220}
        height={220}
      />
      <div className="text-sm font-semibold line-clamp-2 h-[2.5rem] mb-1 ml-2 text-gray-900">
        {product.name}
      </div>
      <div className="text-xs text-gray-500 mb-1 ml-2">{product.brand}</div>
      <div className="flex items-center mb-1 ml-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(product.rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
      </div>
      <div className="text-red-600 text-sm font-bold ml-2 mb-2">
        {product.price.toLocaleString('vi-VN')}₫
      </div>
    </Link>
  );
}

function LoadingCards() {
  return Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="animate-pulse bg-gray-100 h-40 rounded-lg" />
  ));
}
