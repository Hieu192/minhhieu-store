'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import CompareModal from '@/components/compare/CompareModal';
import { Product, ProductVariant } from '@/types/product';
import SafeImage from '@/ultis/SafeImage';

interface CompareItem {
  productId: number;
  variantId: number;
  slug: string;
  categorySlug: string;
}

export default function ComparePage() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Load localStorage
  useEffect(() => {
    const storedIds = localStorage.getItem('compare');
    const storedDetails = localStorage.getItem('compareDetails');
    const ids: number[] = storedIds ? JSON.parse(storedIds) : [];
    const details: CompareItem[] = storedDetails ? JSON.parse(storedDetails) : [];

    // Không cần chọn variant mặc định nữa, dùng luôn variantId từ compare
    setItems(details.filter(d => ids.includes(d.variantId)).slice(0, 3));
  }, []);

  // Fetch products theo slug
  useEffect(() => {
    if (items.length === 0) return;

    const fetchProducts = async () => {
      try {
        const slugs = items.map((i) => i.slug).join(',');
        const res = await fetch(`/api/products/by-slugs?slugs=${slugs}`);
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, [items]);

  // Map variant mặc định giá thấp nhất cho attributes
  const defaultVariantsMap = useMemo(() => {
    const map = new Map<number, ProductVariant>(); // key: productId
    products.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        const cheapest = p.variants.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), p.variants[0]);
        map.set(p.id, cheapest);
      }
    });
    return map;
  }, [products]);

  // Gom product + variant theo compareItems
  const compareSlots = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i) => {
      const item = items[i];
      if (!item) return null;
      const product = products.find(p => p.slug === item.slug);
      if (!product) return null;
      const variant = product.variants.find(v => v.id === item.variantId) || null;
      return { product, variant, item };
    });
  }, [items, products]);

  const remove = (variantId: number) => {
    const idsRaw = localStorage.getItem('compare');
    const detailsRaw = localStorage.getItem('compareDetails');
    const ids: number[] = idsRaw ? JSON.parse(idsRaw) : [];
    const details: CompareItem[] = detailsRaw ? JSON.parse(detailsRaw) : [];

    const updatedIds = ids.filter((id) => id !== variantId);
    const updatedDetails = details.filter((d) => d.variantId !== variantId);

    localStorage.setItem('compare', JSON.stringify(updatedIds));
    localStorage.setItem('compareDetails', JSON.stringify(updatedDetails));
    setItems(updatedDetails);
  };

  const rows = useMemo(() => {
    const firstProduct = compareSlots.find((s) => s !== null)?.product;
    if (!firstProduct) return [];

    return [
      { label: 'Tên', render: (p: Product) => p.name },
      { label: 'Giá', render: (p: Product) => p.price.toLocaleString('vi-VN') + '₫' },
      { label: 'Thương hiệu', render: (p: Product) => p.brand },
      { label: 'Đánh giá', render: (p: Product) => p.rating + '★' },
      { label: 'Mô tả', render: (p: Product) => p.description },
      ...(firstProduct.variants && defaultVariantsMap.get(firstProduct.id)?.attributes
        ? Object.keys(defaultVariantsMap.get(firstProduct.id)!.attributes).map(key => ({
            label: key,
            render: (p: Product) => defaultVariantsMap.get(p.id)?.attributes[key] || '-',
          }))
        : []),
    ];
  }, [compareSlots, defaultVariantsMap]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">So sánh sản phẩm</h1>
      <div className="overflow-auto rounded-xl border shadow-md">
        <table className="w-full table-fixed border text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left border bg-gray-50 min-w-[110px] w-[150px]">Thông số</th>
              {compareSlots.map((slot, idx) => (
                <th key={idx} className="p-3 text-center border relative min-w-[110px] ">
                  {slot ? (
                    <>
                      <button
                        onClick={() => remove(slot.item.variantId)}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full border z-50"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      <div className="flex justify-center mt-2">
                        <SafeImage src={slot.variant?.image || slot.product.image} alt={slot.product.name} />
                      </div>
                      <div className="font-semibold text-sm mb-2">
                        {slot.product.name}
                        {slot.variant?.name ? ` - ${slot.variant.name}` : ''}
                      </div>
                      <button
                        onClick={() => router.push(`/checkout?product=${slot.product.id}`)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition"
                      >
                        Mua ngay
                      </button>
                    </>
                  ) : (
                    <div
                      className="h-40 flex items-center justify-center text-sm text-gray-400 cursor-pointer hover:bg-gray-50"
                      onClick={() => setShowModal(true)}
                    >
                      Nhấn để thêm
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="p-3 font-medium border bg-gray-50">{row.label}</td>
                {compareSlots.map((slot, idx) => (
                  <td key={idx} className="p-3 text-center border">
                    {slot ? row.render(slot.product) : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CompareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={(item: CompareItem) => {
            const exists = items.find((i) => i.slug === item.slug);
            let newItems: CompareItem[];
            if (exists) {
              newItems = items;
            } else if (items.length < 3) {
              newItems = [...items, item];
            } else {
              newItems = [item, ...items.slice(0, 2)];
            }
            setItems(newItems);
            // Cập nhật localStorage
            const ids = newItems.map((i) => i.variantId);
            localStorage.setItem('compare', JSON.stringify(ids));
            localStorage.setItem('compareDetails', JSON.stringify(newItems));
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
