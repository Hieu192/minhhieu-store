'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import CompareModal from '@/components/compare/CompareModal'; // nếu có
import { Product } from '@/types/product';
import SafeImage from '@/ultis/SafeImage';

export default function ComparePage() {
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('compare');
    if (stored) {
      setCompareSlugs(JSON.parse(stored).slice(0, 3));
    }
  }, []);

  useEffect(() => {
    if (compareSlugs.length === 0) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/by-slugs?slugs=${compareSlugs.join(',')}`);
        const data = await res.json();
        setProducts(data);
        // if (data.length > 0) setIsVisible(true);
      } catch (err) {
        console.error('Failed to fetch compared products', err);
      }
    };

      fetchProducts();
  }, [compareSlugs]);

  const remove = (slug: string) => {
    const updated = compareSlugs.filter((x) => x !== slug);
    setCompareSlugs(updated);
    localStorage.setItem('compare', JSON.stringify(updated));
  };

  const addProduct = (slug: string) => {
    const updated = [...compareSlugs.filter((x) => x !== slug), slug].slice(0, 3);
    setCompareSlugs(updated);
    localStorage.setItem('compare', JSON.stringify(updated));
  };

  const items = compareSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is typeof products[number] => Boolean(p));

  // Lấy 3 sản phẩm cố định, nếu thiếu thì tạo slot trống
  const compareSlots: (typeof products[number] | null)[] = Array.from({ length: 3 }).map((_, i) => items[i] ?? null);

  const rows = [
    { label: 'Tên', render: (p: any) => p.name },
    { label: 'Giá', render: (p: any) => p.price.toLocaleString('vi-VN') + '₫' },
    { label: 'Thương hiệu', render: (p: any) => p.brand },
    { label: 'Đánh giá', render: (p: any) => p.rating + '★' },
    { label: 'Mô tả', render: (p: any) => p.description },
    ...(items[0]?.attributes
      ? Object.keys(items[0].attributes).map((key) => ({
          label: key,
          render: (p: any) => p.attributes[key] || '-',
        }))
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">So sánh sản phẩm</h1>
      <div className="overflow-auto rounded-xl border shadow-md">
        <table className="w-full table-fixed border text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left border bg-gray-50 min-w-[110px] w-[150px]">Thông số</th>
              {compareSlots.map((p, idx) => (
                <th key={idx} className="p-3 text-center border relative min-w-[110px] ">
                  {p ? (
                    <>
                      <button
                        onClick={() => remove(p.slug)}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full border"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      {/* <img
                        src={p.image}
                        alt={p.name}
                        className="w-20 h-20 object-cover mx-auto rounded mb-2"
                      /> */}
                      <div className="flex justify-center mt-2">
                        <SafeImage
                          src={p.image}
                          alt={p.name}
                          width={250}
                          height={250}
                        />
                      </div>
                      <div className="font-semibold text-sm mb-2">{p.name}</div>
                      <button
                        onClick={() => router.push(`/checkout?product=${p.id}`)}
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
                {compareSlots.map((p, idx) => (
                  <td key={idx} className="p-3 text-center border">
                    {p ? row.render(p) : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chọn sản phẩm nếu bạn có */}
      <CompareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={(slug) => {
          addProduct(slug);
          setShowModal(false);
        }}
      />
    </div>
  );
}
