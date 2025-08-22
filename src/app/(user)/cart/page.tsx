'use client';

import { useCart } from '@/context/Cartcontext';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    selectedItems,
    setSelectedItems,
    getSelectedTotalPrice,
    getSelectedTotalQuantity,
  } = useCart();

  const totalQuantity = getSelectedTotalQuantity();
  const totalPrice = getSelectedTotalPrice();

  // Tạo key productId-variantId
  const makeKey = (productId: number, variantId?: number) =>
    variantId ? `${productId}-${variantId}` : `${productId}`;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const handleCheckboxChange = (key: string) => {
    setSelectedItems((prevSelected: string[]) =>
      prevSelected.includes(key)
        ? prevSelected.filter(itemKey => itemKey !== key)
        : [...prevSelected, key]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(item => makeKey(item.product.id, item.variant?.id)));
    } else {
      setSelectedItems([]);
    }
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      const key = makeKey(item.product.id, item.variant?.id);
      if (
        selectedItems.includes(key) &&
        (item.variant?.originalPrice || item.product.originalPrice) &&
        (item.variant?.originalPrice || item.product.originalPrice)! >
          (item.variant?.price || item.product.price)
      ) {
        const original = item.variant?.originalPrice || item.product.originalPrice!;
        const current = item.variant?.price || item.product.price;
        return total + (original - current) * item.quantity;
      }
      return total;
    }, 0);
  };

  const totalSavings = getTotalSavings();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Giỏ hàng trống
          </h1>
          <Link
            href="/products"
            className="text-blue-600 hover:underline font-medium"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 py-4 md:py-8">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 md:mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
          Giỏ hàng
        </h1>
        <p className="text-sm text-gray-700">
          Ngay sau khi nhận được đơn đặt hàng, đội ngũ chăm sóc của 
          <span className="font-semibold text-blue-600"> MinhHieu </span>
          sẽ liên hệ để xác nhận và hỗ trợ giao hàng.
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white px-4 pb-4 sm:p-6 rounded-lg shadow-md">
        {/* 📱 Mobile view */}
        <div className="md:hidden divide-y">
          <div className="py-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm font-semibold text-gray-700">
              Chọn tất cả ({cartItems.length})
            </span>
          </div>
          {cartItems.map((item) => {
            const key = makeKey(item.product.id, item.variant?.id);
            const image = item.variant?.image || item.product.image;
            const name = `${item.product.name}${item.variant ? ` - ${item.variant.name}` : ''}`;
            const price = item.variant?.price || item.product.price;
            const originalPrice = item.variant?.originalPrice || item.product.originalPrice;

            return (
              <div key={key} className="relative py-4 flex flex-col gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                  className="absolute top-2 left-0 w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <button
                  onClick={() => removeFromCart(key)}
                  className="absolute top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full border bg-white shadow-sm text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3 mt-4">
                  <img src={image} alt={name} className="w-20 h-20 object-cover rounded" />
                  <Link href={`/products/${item.product.slug}${item.variant ? `?variantId=${item.variant.id}` : ''}`}>
                    <h2 className="text-base font-semibold text-gray-900">{name}</h2>
                    <p className="text-xs text-gray-600">{item.product.brand}</p>
                  </Link>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá:</span>
                  <span className="font-medium">{formatPrice(price)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Số lượng:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      className="p-1 border rounded w-7 h-7 flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      className="p-1 border rounded w-7 h-7 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-bold text-red-600">
                    {formatPrice(price * item.quantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 💻 Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 w-16 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                </th>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3 w-36">Giá</th>
                <th className="p-3 w-44">Số lượng</th>
                <th className="p-3 w-40">Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const key = makeKey(item.product.id, item.variant?.id);
                const image = item.variant?.image || item.product.image;
                const name = `${item.product.name}${item.variant ? ` - ${item.variant.name}` : ''}`;
                const price = item.variant?.price || item.product.price;
                const originalPrice = item.variant?.originalPrice || item.product.originalPrice;

                return (
                  <tr key={key} className="border-b">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(key)}
                        onChange={() => handleCheckboxChange(key)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <img src={image} alt={name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <Link href={`/products/${item.product.slug}${item.variant ? `?variantId=${item.variant.id}` : ''}`}>
                          <span className="font-semibold hover:text-blue-600">{name}</span>
                        </Link>
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                      </div>
                    </td>
                    <td className="p-3 w-36">
                      <div className="flex flex-col">
                        <span className="text-red-600 font-bold">{formatPrice(price)}</span>
                        {originalPrice && (
                          <span className="text-sm line-through text-gray-400 ml-1">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>

                    </td>
                    <td className="p-3 w-44">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          className="p-1 border rounded w-8 h-8 flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="p-1 border rounded w-8 h-8 flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(key)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded w-8 h-8 flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 w-40 font-bold text-red-600">
                      {formatPrice(price * item.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tổng cộng */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4 gap-3">
          <div>
            <p className="text-lg md:text-xl text-gray-900">
              Tổng cộng: <span className="text-red-600 font-bold">{formatPrice(totalPrice)}</span>
            </p>
            <p className="text-sm">
              Tiết kiệm: <span className="text-blue-600">{formatPrice(totalSavings)}</span>
            </p>
          </div>
          <Link
            href="/checkout"
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg transition text-center 
              ${selectedItems.length === 0 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            Mua ngay {totalQuantity > 0 ? `(${totalQuantity})` : ''}
          </Link>
        </div>
      </div>
    </div>
  );
}
