'use client';

import { ShoppingCart, Heart, Star, MessageSquareText } from 'lucide-react';
import { Product } from '@/types/product';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import SafeImage from '@/ultis/SafeImage';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const [hovered, setHovered] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  return (
    <div
      className="relative z-10 group bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg">
          <SafeImage
            src={product.image}
            alt={product.name}
            width={400}
            height={500}
          />
          
          {/* Badges */}
          {product.badges?.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {product.badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    badge === 'Mới'
                      ? 'bg-green-100 text-green-800'
                      : badge === 'Bán chạy'
                      ? 'bg-blue-100 text-blue-800'
                      : badge === 'Giảm giá'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <button
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="p-1 relative md:py-2 md:px-3 md:pb-5 bg-gray-100">
          <h3 className="text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] text-sm md:text-base">
            {product.name}
          </h3>
          {/* <p className="text-sm text-gray-600 line-clamp-1 mb-2">{product.brand}</p> */}

          <div className="hidden md:flex items-center mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviews})
            </span>
          </div>

          {/* <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col items-start space-y-1">
              <span className="text-sm md:text-base font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm md:text-base text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div> */}

          <div className="flex flex-col md:flex-row items-start md:items-center mb-1 space-y-1 md:space-y-0 md:space-x-2">
            <span className="text-sm md:text-base font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm md:text-base text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Hover buttons — absolute bottom overlay */}
      <div
        className={`
          absolute bottom-0 left-0 w-full px-2 py-2 z-10
          bg-white/80 backdrop-blur-sm transition-all duration-300
          flex justify-center gap-2
          ${
            hovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
          }
          md:absolute
        `}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onAddToCart(product);
          }}
          className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700 transition"
        >
          <ShoppingCart className="inline-block mr-1 h-4 w-4" />
          Giỏ hàng
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            alert('Chức năng đánh giá sẽ được cập nhật sau!');
          }}
          className="flex-1 border border-gray-300 text-sm py-1.5 rounded hover:bg-gray-100 transition flex items-center justify-center"
        >
          <MessageSquareText className="h-4 w-4 mr-1 text-gray-500" />
          Đánh giá
        </button>
      </div>
    </div>
  );
}
