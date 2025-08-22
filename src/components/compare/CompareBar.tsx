'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import CompareModal from './CompareModal';
import { usePathname } from 'next/navigation';
import { Product } from '@/types/product';
import SafeImage from '@/ultis/SafeImage';

interface CompareItem {
  productId: number;
  variantId: number;
  slug: string;
  categorySlug: string;
}

export default function CompareBar() {
  const [variantIds, setVariantIds] = useState<number[]>([]);
  const [items, setItems] = useState<CompareItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Đọc từ localStorage và đồng bộ state
  useEffect(() => {
    const update = () => {
      const storedIds = localStorage.getItem('compare');
      const ids: number[] = storedIds ? JSON.parse(storedIds) : [];

      const storedDetails = localStorage.getItem('compareDetails');
      const details: CompareItem[] = storedDetails ? JSON.parse(storedDetails) : [];

      const top3 = ids.slice(0, 3);

      // Map theo thứ tự variantIds
      const detailMap = new Map(details.map((d) => [d.variantId, d]));
      const top3Details = top3
        .map((id) => detailMap.get(id))
        .filter(Boolean) as CompareItem[];

      setVariantIds(top3);
      setItems(top3Details);
      setIsVisible(top3.length > 0);
    };

    update();
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('storage', update);
    };
  }, []);

  // Ép bật bar từ nơi khác
  useEffect(() => {
    const handleShowBar = () => setIsVisible(true);
    window.addEventListener('show-compare-bar', handleShowBar);
    return () => window.removeEventListener('show-compare-bar', handleShowBar);
  }, []);

  // Mỗi khi chuyển route → ẩn bar
  useEffect(() => {
    setIsVisible(false);
  }, [pathname]);

  // Fetch products theo slug từ items (giữ API cũ)
  useEffect(() => {
    if (items.length === 0) {
      setSelectedProducts([]);
      return;
    }
    const fetchProducts = async () => {
      try {
        const slugs = items.map((i) => i.slug).join(',');
        const res = await fetch(`/api/products/by-slugs?slugs=${slugs}`);
        const data: Product[] = await res.json();
        setSelectedProducts(data);
      } catch (err) {
        console.error('Failed to fetch compared products', err);
      }
    };
    fetchProducts();
  }, [items]);

  // Gom dữ liệu product + variant theo CompareItem
  const cards = useMemo(() => {
    return items
      .map((it) => {
        const product = selectedProducts.find((p) => p.slug === it.slug);
        const variant = product?.variants?.find((v) => v.id === it.variantId) || null;
        return product ? { product, variant, item: it } : null;
      })
      .filter(Boolean) as { product: Product; variant: any; item: CompareItem }[];
  }, [items, selectedProducts]);

  const remove = (variantId: number) => {
    const idsRaw = localStorage.getItem('compare');
    const detailsRaw = localStorage.getItem('compareDetails');

    const ids: number[] = idsRaw ? JSON.parse(idsRaw) : [];
    const details: CompareItem[] = detailsRaw ? JSON.parse(detailsRaw) : [];

    const updatedIds = ids.filter((id) => id !== variantId);
    const updatedDetails = details.filter((d) => d.variantId !== variantId);

    localStorage.setItem('compare', JSON.stringify(updatedIds));
    localStorage.setItem('compareDetails', JSON.stringify(updatedDetails));

    // Cập nhật UI qua cơ chế cũ
    window.dispatchEvent(new Event('storage'));

    if (updatedIds.length === 0) setIsVisible(false);
  };

  if (!isVisible || cards.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 p-2 md:p-4 ">
      <div className="flex flex-col w-full md:w-auto md:flex-row bg-white border shadow-lg rounded-md items-center gap-4 pb-2">
        <div className="flex flex-col w-full md:w-auto md:flex-row md:gap-3 px-4 justify-center">
          {cards.map(({ product, variant, item }) => (
            <div
              key={item.variantId}
              className="relative w-full h-24 md:w-56 md:h-28 flex-shrink-0 border rounded-md text-center mt-2 md:my-3"
            >
              <div className="flex w-16 md:w-20 justify-center mt-1 mx-auto">
                <SafeImage
                  src={variant?.image || product.image}
                  alt={product.name + (variant?.name ? ` - ${variant.name}` : '')}
                />
              </div>
              <p className="text-xs line-clamp-2">
                {product.name}
                {variant?.name ? ` - ${variant.name}` : ''}
              </p>
              <button
                onClick={() => remove(item.variantId)}
                className="absolute top-1 left-1 md:left-auto md:right-1 bg-white rounded-full shadow p-1 border hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Ô trống nếu < 3 */}
          {Array.from({ length: 3 - cards.length }).map((_, i) => (
            <div
              key={i}
              onClick={() => setShowModal(true)}
              className="w-full h-24 md:w-56 md:h-28 flex items-center justify-center border rounded-md text-xs text-gray-400 bg-gray-50 transition whitespace-nowrap mt-2 md:my-3"
            >
              + Chọn sản phẩm để so sánh
            </div>
          ))}
        </div>

        {/* Nút */}
        <div className="flex flex-col gap-2 mr-4">
          <p className="text-sm text-gray-700 font-medium">
            Đã chọn {cards.length} sản phẩm
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsVisible(false)}
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

      {showModal && (
        <CompareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={(item) => {
            // item: CompareItem { productId, variantId, slug, categorySlug }
            const idsRaw = localStorage.getItem('compare');
            const detailsRaw = localStorage.getItem('compareDetails');

            const ids: number[] = idsRaw ? JSON.parse(idsRaw) : [];
            const details: CompareItem[] = detailsRaw ? JSON.parse(detailsRaw) : [];

            // Trùng theo variant?
            if (ids.includes(item.variantId)) {
              window.dispatchEvent(new Event('show-compare-bar'));
              return;
            }

            // Cùng category?
            const sameCategory = details.every(
              (d) => d.categorySlug === item.categorySlug
            );

            let updatedIds: number[];
            let updatedDetails: CompareItem[];

            if (ids.length === 0 || sameCategory) {
              updatedIds = [item.variantId, ...ids.filter((id) => id !== item.variantId)].slice(0, 3);
              updatedDetails = [item, ...details.filter((d) => d.variantId !== item.variantId)].slice(0, 3);
            } else {
              // khác category → reset
              updatedIds = [item.variantId];
              updatedDetails = [item];
            }

            localStorage.setItem('compare', JSON.stringify(updatedIds));
            localStorage.setItem('compareDetails', JSON.stringify(updatedDetails));

            // Đồng bộ + ép bật bar
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('show-compare-bar'));
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
