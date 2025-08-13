'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import CompareModal from './CompareModal';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types/product';
import SafeImage from '@/ultis/SafeImage';


export default function CompareBar() {
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  // Đồng bộ localStorage
  useEffect(() => {
    const update = () => {
      const stored = localStorage.getItem('compare');
      const slugs = stored ? JSON.parse(stored) : [];
      setCompareSlugs(slugs.slice(0, 3));
      // if (ids.length > 0) setIsVisible(true);
    };

    update();
    window.addEventListener('storage', update);
    // const interval = setInterval(update, 300); // cập nhật liên tục
    return () => {
      window.removeEventListener('storage', update);
      // clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleShowBar = () => setIsVisible(true);
    window.addEventListener('show-compare-bar', handleShowBar);

    return () => {
      window.removeEventListener('show-compare-bar', handleShowBar);
    };
  }, []);

  useEffect(() => {
    // Mỗi khi chuyển route → ẩn bar
    setIsVisible(false);
  }, [pathname]);

  const remove = (slug: string) => {
    const updated = compareSlugs.filter((x) => x !== slug);
    localStorage.setItem('compare', JSON.stringify(updated));
    // localStorage.setItem('compareDetail', JSON.stringify(updated));
    setCompareSlugs(updated);

    if (updated.length === 0) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (compareSlugs.length === 0) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/by-slugs?slugs=${compareSlugs.join(',')}`);
        const data = await res.json();
        setSelectedProducts(data);
        // if (data.length > 0) setIsVisible(true);
      } catch (err) {
        console.error('Failed to fetch compared products', err);
      }
    };

      fetchProducts();
  }, [compareSlugs]);

  // useEffect(() => {
  //   console.log('CompareBar mounted');
  //   return () => console.log('CompareBar unmounted');
  // }, []);

  if (!isVisible || selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 p-3 md:p-4 ">
      {/* <div className="bg-white border shadow-lg rounded-md w-full max-w-screen-lg flex items-center gap-4"> */}
      <div className="inline-flex bg-white border shadow-lg rounded-md items-center gap-4">
        <div className="flex gap-3 px-4 justify-center">
          {selectedProducts.map((product) => (
            <div key={product.id} className="relative w-56 h-28 flex-shrink-0 border rounded-md text-center my-3">
              <div className="flex justify-center mt-2">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  // width={60}
                  // height={60}
                />
              </div>
              <p className="text-xs line-clamp-2 my-2">{product.name}</p>
              <button
                onClick={() => remove(product.slug)}
                className="absolute top-1 right-1 bg-white rounded-full shadow p-1 border hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Hiển thị chỗ trống nếu < 3 */}
          {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
            <div
              key={i}
              onClick={() => setShowModal(true)}
              className="w-56 h-28 flex items-center justify-center border rounded-md text-xs text-gray-400 bg-gray-50 transition whitespace-nowrap my-3"
            >
              + Chọn sản phẩm để so sánh
            </div>
          ))}
        </div>

        {/* Nút chuyển đến trang so sánh */}
        <div className="flex flex-col gap-2 mr-4">
          {/* Hàng 1: Thông báo */}
          <p className="text-sm text-gray-700 font-medium">
            Đã chọn {selectedProducts.length} sản phẩm
          </p>

          {/* Hàng 2: 2 nút canh phải */}
          <div className="flex justify-end gap-3">
            <button
              // onClick={() => setShowBar(false)}
              className="px-3 py-2 text-sm rounded-md border hover:bg-gray-100 transition"
            >
              Thu gọn
            </button>
            <button
              onClick={() => (window.location.href = '/compare')}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              So sánh
            </button>
          </div>
        </div>
      </div>
      {showModal && 
        <CompareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={(slug) => {
            const updated = [...compareSlugs, slug].slice(0, 3);
            localStorage.setItem('compare', JSON.stringify(updated));
            setCompareSlugs(updated);
          }}
        />
      }
    </div>
  );
}
