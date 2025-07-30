'use client';

import { ShoppingCart, Heart, LineChart, Star } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorageList } from '@/hooks/useLocalStorageList';
import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import Image from 'next/image';
import SafeImage from '@/ultis/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailClient({ product }: { product: Product }) {
  const [mainImage, setMainImage] = useState<string>('');
  const thumbnailsRef = useRef<HTMLImageElement[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ name: '', stars: 5, comment: '' });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const { addToCart } = useCart();
  const { toggle: toggleFav, has: isFav } = useLocalStorageList('favorites');
  const { add: addCompare, has: isCompare } = useLocalStorageList('compare');

  useEffect(() => {
    if (product?.image) {
      setMainImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    // Lưu slug đã xem
    const stored = localStorage.getItem('recentlyViewed');
    const viewed: string[] = stored ? JSON.parse(stored) : [];
    const updatedViewed = [product.slug, ...viewed.filter(s => s !== product.slug)];
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed.slice(0, 10)));

    const fetchMore = async () => {
      try {
        // Fetch recently viewed
        const recentRes = await fetch(`/api/products/slug-list?slugs=${updatedViewed.join(',')}`);
        const recent = await recentRes.json();

        // Đảm bảo thứ tự giống `updatedViewed`
        const sortedRecent = updatedViewed
          .filter((slug) => slug !== product.slug) // bỏ chính nó
          .map((slug) => recent.find((p: Product) => p.slug === slug))
          .filter(Boolean)
          .slice(0, 6); // chỉ lấy 6

        setRecentlyViewed(sortedRecent);

        // Fetch related
        const relatedRes = await fetch(`/api/categories/${product.category.slug}/products?limit=10`);
        const related = await relatedRes.json();
        const filteredRelated = related
          .filter((p: Product) => p.slug !== product.slug)
          .slice(0, 6);

        setRelatedProducts(filteredRelated);
      } catch (err) {
        console.error('Failed to fetch extras:', err);
      }
    };

    fetchMore();

    const storedReviews = localStorage.getItem(`reviews-${product.slug}`);
    if (storedReviews) setReviews(JSON.parse(storedReviews));
  }, [product]);


  const handleReviewSubmit = () => {
    if (!product) return;
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews-${product.slug}`, JSON.stringify(updated));
    setNewReview({ name: '', stars: 5, comment: '' });
  };

  const addToCompareAndShowBar = () => {
    if (!product) return;

    const stored = localStorage.getItem('compare');
    const list: string[] = stored ? JSON.parse(stored) : [];

    // Dữ liệu mở rộng (giữ slug và category slug)
    const storedDetailsRaw = localStorage.getItem('compareDetails');
    const storedDetails: { slug: string; categorySlug: string }[] = storedDetailsRaw
      ? JSON.parse(storedDetailsRaw)
      : [];
    const alreadyIncluded = list.includes(product.slug);

    // Nếu đã có rồi, chỉ cần hiện CompareBar
    if (alreadyIncluded) {
      window.dispatchEvent(new Event('show-compare-bar'));
      return;
    }
    const sameCategory = storedDetails.every(
      (item) => item.categorySlug === product.category.slug
    );

    let updated: string[];
    let updatedDetails: { slug: string; categorySlug: string }[];

    if (list.length === 0 || sameCategory) {
      // Cùng category hoặc chưa có gì
      const alreadyIncluded = list.includes(product.slug);
      if (alreadyIncluded) return;

      updated = [product.slug, ...list].slice(0, 3);
      updatedDetails = [
        { slug: product.slug, categorySlug: product.category.slug },
        ...storedDetails,
      ].slice(0, 3);
    } else {
      // Khác category => reset
      updated = [product.slug];
      updatedDetails = [{ slug: product.slug, categorySlug: product.category.slug }];
    }

    localStorage.setItem('compare', JSON.stringify(updated));
    localStorage.setItem('compareDetails', JSON.stringify(updatedDetails));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('show-compare-bar'));
  };

  const handleThumbnailClick = (img: string, index: number) => {
    if (!product?.gallery) return;

    const currentIdx = product.gallery.findIndex(i => i === mainImage);
    setDirection(index > currentIdx ? 1 : -1);
    setMainImage(img);

    const el = thumbnailsRef.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleArrowClick = (dir: number) => {
    if (!product?.gallery) return;

    const currentIdx = product.gallery.findIndex(i => i === mainImage);
    const newIdx = (currentIdx + dir + product.gallery.length) % product.gallery.length;

    setDirection(dir);
    setMainImage(product.gallery[newIdx]);
  };


  if (!product) {
    return <div className="p-6 text-center text-red-500">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Thông tin sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div>
          {/* Ảnh chính với hiệu ứng trượt và nút trái/phải */}
          <div className="relative w-full">
            <AnimatePresence custom={direction} mode="wait">
              <motion.img
                key={mainImage}
                src={mainImage}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-md object-contain"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
                }}
              />
            </AnimatePresence>
            {/* Mũi tên điều hướng */}
            <button
              onClick={() => handleArrowClick(-1)}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => handleArrowClick(1)}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="flex mt-4 gap-3 overflow-x-auto scrollbar-hide">
            {(product.gallery || []).map((img, idx) => (
              <img
                key={idx}
                ref={(el) => {
                  if (el) thumbnailsRef.current[idx] = el;
                }}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => handleThumbnailClick(img, idx)}
                className={`w-20 h-20 rounded cursor-pointer object-cover border ${mainImage === img ? 'border-blue-500' : 'border-gray-200'}`}
                onError = {(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
                }}
              />
            ))}
          </div>
        </div>

        {/* Thông tin mô tả */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{product.brand}</p>
          <div className="flex items-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600">({product.reviews} đánh giá)</span>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold text-red-600">{product.price.toLocaleString('vi-VN')}₫</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm line-through text-gray-500">{product.originalPrice.toLocaleString('vi-VN')}₫</p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {Object.entries(product.attributes).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => addToCart(product)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              <ShoppingCart className="inline-block mr-2 h-5 w-5" /> Thêm vào giỏ
            </button>
            <button onClick={() => toggleFav(product.id)} className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition">
              <Heart className={`inline-block mr-1 h-5 w-5 ${isFav(product.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
              {isFav(product.id) ? 'Đã thích' : 'Yêu thích'}
            </button>
            <button onClick={addToCompareAndShowBar} className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition">
              <LineChart className={`inline-block mr-1 h-5 w-5 ${isCompare(product.id) ? 'text-blue-500' : 'text-gray-500'}`} /> So sánh
            </button>
          </div>
        </div>
      </div>

      {/* Sản phẩm đã xem */}
      {recentlyViewed.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Bạn đã xem gần đây</h2>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {recentlyViewed.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>
        <div className="space-y-4">
          {reviews.map((r, idx) => (
            <div className="border p-4 rounded" key={idx}>
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.stars ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">{r.name}</span>
              </div>
              <p className="text-gray-700 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

        <div className="border p-4 rounded mt-6">
          <h3 className="text-md font-semibold mb-2">Gửi đánh giá</h3>
          <input type="text" placeholder="Tên của bạn" className="w-full border p-2 rounded mb-2" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} />
          <textarea placeholder="Nội dung" className="w-full border p-2 rounded mb-2" rows={3} value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 cursor-pointer ${i < newReview.stars ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setNewReview({ ...newReview, stars: i + 1 })} />
            ))}
          </div>
          <button onClick={handleReviewSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Gửi đánh giá</button>
        </div>
      </div>
    </div>
  );
}