'use client';

import { ShoppingCart, Heart, LineChart, Star, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorageList } from '@/hooks/useLocalStorageList';
import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { capitalizeWords, parseContent } from '@/ultis/helps';
import { useRouter } from 'next/navigation';

export default function ProductDetailClient({ product, breadcrumb }: { product: Product, breadcrumb: { name: string; slug: string }[]; }) {
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  const { addToCart, setSelectedItems } = useCart();
  const router = useRouter();
  // const { toggle: toggleFav, has: isFav } = useLocalStorageList('favorites');
  const { add: addCompare, has: isCompare } = useLocalStorageList('compare');
  const [quantity, setQuantity] = useState(1);

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
          .slice(0, 5); // chỉ lấy 5

        setRecentlyViewed(sortedRecent);

        // Fetch related
        const relatedRes = await fetch(`/api/categories/${product.category.slug}/products?limit=10`);
        const related = await relatedRes.json();
        const filteredRelated = related
          .filter((p: Product) => p.slug !== product.slug)
          .slice(0, 5);

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

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

    // Logic mua ngay, ví dụ chuyển hướng đến trang thanh toán
  const handleBuyNow = () => {
    // 1. Thêm sản phẩm vào giỏ hàng
    addToCart(product, quantity);

    // 2. Chỉ chọn duy nhất sản phẩm này trong giỏ hàng
    setSelectedItems([product.id]);

    // 3. Chuyển hướng người dùng tới trang thanh toán
    router.push('/cart');
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

  useEffect(() => {
    // Lấy chiều cao màn hình
    const screenHeight = window.innerHeight;
    setMaxHeight(screenHeight);

    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      if (scrollHeight > screenHeight) {
        setIsOverflowing(true);
      }
    }
  }, []);

  if (!product) {
    return <div className="p-6 text-center text-red-500">Không tìm thấy sản phẩm</div>;
  }

  {/* Structured Data for SEO */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: [product.image, ...(product.gallery || [])],
        description: product.description,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: product.brand || "No Brand",
        },
        offers: {
          "@type": "Offer",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}`,
          priceCurrency: "VND",
          price: product.price,
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating || 4.5,
          reviewCount: product.reviews || 10,
        },
      }),
    }}
  />

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 ">
      <div className="max-w-7xl mx-auto sm:px-6 md:px-8">
          <div className="text-sm md:text-base text-gray-600 mb-4 bg-gray-200 p-3 rounded-md flex flex-nowrap overflow-x-auto">
            <Link href="/" className="hover:underline flex-shrink-0">🏠Trang chủ</Link>
            {breadcrumb.map((item) => (
              <span key={item.slug} className="flex-shrink-0">
                <span className="mx-2">/</span>
                <Link href={`/${item.slug}`} className="hover:underline">
                  {capitalizeWords(item.name)}
                </Link>
              </span>
            ))}
            <span className="mr-2">/</span>
            <span className="mr-2 text-blue-600 flex-shrink-0">{capitalizeWords(product.name)}</span>
          </div>
        {/* Thông tin sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hình ảnh */}
          <div>
            {/* Ảnh chính với hiệu ứng trượt và nút trái/phải */}
            <div className="relative w-full aspect-square rounded-lg shadow-md flex items-center justify-center overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.img
              key={mainImage}
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain"
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
                  className={`w-20 h-20 rounded cursor-pointer object-contain border ${mainImage === img ? 'border-blue-500' : 'border-gray-200'}`}
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
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-base text-gray-500 mb-4">{product.brand}</p>
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="text-base text-gray-600">({product.reviews} đánh giá)</span>
            </div>

            <div className="mb-4 md:flex md:items-end">
              <p className="text-2xl font-bold text-red-600">{product.price.toLocaleString('vi-VN')}₫</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex  md:ml-4">
                  <p className="text-sm line-through text-gray-500">{product.originalPrice.toLocaleString('vi-VN')}₫</p>
                  <span className="ml-1 text-sm text-blue-500">
                    (-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              {/* <p className="text-gray-700">{product.description}</p> */}
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {Object.entries(product.attributes || {}).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>

            {/* Nút tăng giảm số lượng */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">

              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-700">Số lượng:</p>
                <button
                  onClick={handleDecrease}
                  className="p-1 border rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="p-1 border rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-lg font-semibold text-gray-700">
                Tạm tính: {(product.price * quantity).toLocaleString('vi-VN')}₫
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => addToCart(product, quantity)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                <ShoppingCart className="inline-block mr-2 h-5 w-5" /> Thêm vào giỏ
              </button>
              {/* <button onClick={() => toggleFav(product.id)} className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition">
                <Heart className={`inline-block mr-1 h-5 w-5 ${isFav(product.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                {isFav(product.id) ? 'Đã thích' : 'Yêu thích'}
              </button> */}
              <button onClick={handleBuyNow} className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Mua ngay
              </button>
              <button onClick={addToCompareAndShowBar} className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition hidden md:flex">
                <LineChart className={`inline-block mr-1 h-5 w-5 ${isCompare(product.id) ? 'text-blue-500' : 'text-gray-500'}`} /> So sánh
              </button>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết sản phẩm */}
        <div className="bg-white mt-4 rounded-lg shadow p-4">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-600 mb-4 border-blue-600 border-b pb-2">
            CHI TIẾT SẢN PHẨM
          </h1>

          <div
            ref={contentRef}
            className={`prose prose-lg max-w-none text-gray-800 leading-relaxed relative transition-all duration-300 ${
              isExpanded ? '' : 'max-h-[${maxHeight}px] overflow-hidden'
            }`}
            style={!isExpanded ? { maxHeight: maxHeight } : {}}
          >
            {parseContent(product.description || '')}

            {/* Hiệu ứng mờ khi chưa mở rộng */}
            {!isExpanded && isOverflowing && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          {/* Nút Xem thêm / Thu gọn */}
          {isOverflowing && (
            <div className="text-center bg-white pt-2">
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-blue-600 hover:underline text-lg font-medium"
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm ...'}
              </button>
            </div>
          )}
        </div>

        {/* Sản phẩm đã xem */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Bạn đã xem gần đây</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {recentlyViewed.map((product) => (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>
          </div>
        )}

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>
          </div>
        )}
        {/* <div className="mt-12">
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
        </div> */}
      </div>
    </div>

  );
}