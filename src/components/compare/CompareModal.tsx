'use client';

import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
import SafeImage from '@/ultis/SafeImage';
import { Product } from '@/types/product';
import { formatPrice } from '@/ultis/helps';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (slug: string) => void;
}

export default function CompareModal({ isOpen, onClose, onAdd }: Props) {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Lấy compare slug và category từ localStorage
    const stored = localStorage.getItem('compare');
    const storedDetails = localStorage.getItem('compareDetails');

    const slugs: string[] = stored ? JSON.parse(stored) : [];
    setCompareList(slugs);

    const details: { slug: string; categorySlug: string }[] = storedDetails
      ? JSON.parse(storedDetails)
      : [];

    if (details.length > 0) {
      const currentCategory = slugs.length > 0 ? details[0].categorySlug : '';
      setCategorySlug(currentCategory);
      // Gọi API sản phẩm theo danh mục
      setLoading(true);
      fetch(`/api/products?category=${currentCategory}&limit=20&offset=0`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data || []);
        })
        .catch((err) => console.error('Error fetching products:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white p-1 rounded-full border shadow hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chọn sản phẩm để so sánh</h2>
        </div>

        <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : products.length === 0 ? (
            <p>Không có sản phẩm nào để so sánh.</p>
          ) : (
            products.map((product) => {
              const alreadyAdded = compareList.includes(product.slug);
              return (
                <div
                  key={product.id}
                  className="border rounded-md pb-2 bg-gray-50 flex flex-col items-center text-center"
                >
                  {/* <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  /> */}
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                  {/* <p className="text-sm line-clamp-2 mb-2">{product.name}</p> */}
                  <p className="text-gray-900 my-1 line-clamp-2 min-h-[2.5rem] text-sm">{product.name}</p>
                  <span className="text-sm md:text-base font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>

                  {alreadyAdded ? (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded flex items-center gap-1 cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" /> Đã thêm
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onAdd(product.slug);
                        onClose(); // đóng modal sau khi thêm
                      }}
                      className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      So sánh
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
