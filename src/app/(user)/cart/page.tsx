'use client';

import { useCart } from '@/context/Cartcontext';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, selectedItems, setSelectedItems, getSelectedTotalPrice, getSelectedTotalQuantity } = useCart();
  // const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const totalQuantity = getSelectedTotalQuantity();
  const totalPrice = getSelectedTotalPrice();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prevSelected: number[]) => // Thêm kiểu dữ liệu ở đây
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.id) && item.originalPrice && item.originalPrice > item.price) {
        return total + (item.originalPrice - item.price) * item.quantity;
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
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 md:mb-8 flex flex-col justify-center items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
          Giỏ hàng
        </h1>
        <p className="text-sm text-gray-700 text-center">
          Ngay sau khi nhận được đơn đặt hàng, đội ngũ chăm sóc của 
          <span className="font-semibold text-blue-600"> MinhHieu </span>
          sẽ liên hệ lại bạn để xác nhận đơn hàng và hỗ trợ giao hàng đến bạn.
        </p>
        <p className="mt-2 font-medium text-blue-800 text-center">
          (Cam kết sản phẩm chất lượng – Hỗ trợ bảo hành đến 20 năm)
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
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <span className="text-sm font-semibold text-gray-700">Chọn tất cả ({cartItems.length})</span>
          </div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="relative py-4 flex flex-col gap-3"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
                className="absolute top-2 left-0 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              {/* Nút X ở góc phải */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="absolute top-2 -right-2 w-6 h-6 flex items-center justify-center 
                          rounded-full border border-gray-300 bg-white shadow-sm
                          text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
              >
                ✕
              </button>

              {/* Ảnh + tên */}
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                  onClick={() => handleCheckboxChange(item.id)}
                />
                <Link href={`/products/${item.slug}`}>
                  <h2 className="text-base font-semibold text-gray-900">{item.name}</h2>
                  <p className="text-xs text-gray-600">{item.brand}</p>
                </Link>
              </div>

              {/* Giá */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giá:</span>
                <span className="font-medium">{formatPrice(item.price)}</span>
              </div>

              {/* Số lượng */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Số lượng:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 border rounded w-7 h-7 flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 border rounded w-7 h-7 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tạm tính */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-bold text-red-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 💻 Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-3 w-16 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  />
                </th>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3 w-36 ">Giá</th>
                <th className="p-3 w-44 ">Số lượng</th>
                <th className="p-3 w-40">Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onClick={() => handleCheckboxChange(item.id)}
                    />
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                      >
                        <span className="font-semibold hover:text-blue-600">{item.name}</span>
                      </Link>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                  </td>

                  {/* Giá */}
                  <td className="p-3 w-36">
                    <span className='text-red-600 font-bold'>{formatPrice(item.price)} </span>
                    {item.originalPrice && (
                      <span className="text-sm line-through text-gray-400">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </td>

                  {/* Số lượng */}
                  <td className="p-3 w-36">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 border rounded w-8 h-8 flex items-center justify-center"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 border rounded w-8 h-8 flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded w-8 h-8 flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>

                  {/* Tạm tính */}
                  <td className="p-3 w-40 font-bold text-red-600">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng cộng */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4 gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-lg md:text-xl text-gray-900">
              Tổng cộng: 
              <span className='text-red-600 font-bold'> {formatPrice(totalPrice)}</span>
            </p>
            <p className="text-sm md:text-sm">
              Tiết kiệm: 
              <span className='text-blue-600'> {formatPrice(totalSavings)}</span>
            </p>
          </div>
          <Link
            href="/checkout"
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg transition text-center 
              ${selectedItems.length === 0 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'}`
            }
          >
            Mua ngay {totalQuantity > 0 ? `(${totalQuantity})` : ''}
          </Link>
        </div>
      </div>
    </div>
  );
}
