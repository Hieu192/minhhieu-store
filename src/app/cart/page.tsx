'use client';

import { useCart } from '@/context/Cartcontext';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
  } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
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
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng của bạn</h1>

        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={item.id} className="py-4 flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
                // width={80}
                // height={80}
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.brand}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 border rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 border rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">
                  {formatPrice(item.price * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-500">
                    ({formatPrice(item.price)} mỗi cái)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center border-t pt-6">
          <p className="text-xl font-bold text-gray-900">
            Tổng cộng: {formatPrice(getTotalPrice())}
          </p>
          <Link
            href="/checkout"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Tiến hành thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
}
