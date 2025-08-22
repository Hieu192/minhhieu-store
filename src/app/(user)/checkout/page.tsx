'use client';

import { useState } from 'react';
import { useCart } from '@/context/Cartcontext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isValidVietnamPhone } from '@/ultis/helps';

export default function CheckoutPage() {
  const {
    cartItems,
    selectedItems,
    getSelectedTotalPrice,
    removeSelectedItemsFromCart,
  } = useCart();
  const router = useRouter();

  // Helper tạo key productId-variantId
  const makeKey = (productId: number, variantId?: number) =>
    variantId ? `${productId}-${variantId}` : `${productId}`;

  // Lọc danh sách chỉ gồm item được chọn
  const selectedCartItems = cartItems.filter(item =>
    selectedItems.includes(makeKey(item.product.id, item.variant?.id))
  );

  const [showAllItems, setShowAllItems] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) setNameError('Vui lòng nhập họ tên');
    if (!address) setAddressError('Vui lòng nhập địa chỉ giao hàng');
    if (!phone) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!isValidVietnamPhone(phone)) {
      setPhoneError(
        'Số điện thoại không hợp lệ. Vui lòng nhập số bắt đầu bằng 0 hoặc +84 và gồm 10–11 chữ số.'
      );
      return;
    }

    const orderData = {
      name,
      phone,
      address,
      note,
      items: selectedCartItems.map(item => ({
        productId: item.product.id,
        variantId: item.variant?.id,
        name: `${item.product.name}${item.variant ? ` - ${item.variant.name}` : ''}`,
        quantity: item.quantity,
        price: item.variant?.price || item.product.price,
        image: item.variant?.image || item.product.image,
      })),
      total: getSelectedTotalPrice(),
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (result.success) {
        alert('Đặt hàng thành công! Cảm ơn bạn.');
        removeSelectedItemsFromCart();
        router.push('/');
      } else {
        setError(result.message || 'Đặt hàng thất bại');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('Có lỗi xảy ra khi gửi đơn hàng');
    }
  };

  if (selectedItems.length === 0) return null;

  const initialItemsToShow = 5;
  const itemsToDisplay = showAllItems
    ? selectedCartItems
    : selectedCartItems.slice(0, initialItemsToShow);
  const remainingItemsCount = selectedCartItems.length - initialItemsToShow;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 md:mb-8 text-center">
        <p className="text-sm text-gray-700">
          Ngay sau khi nhận được đơn đặt hàng, đội ngũ chăm sóc của
          <span className="font-semibold text-blue-600"> MinhHieu </span>
          sẽ liên hệ lại bạn để xác nhận và hỗ trợ giao hàng.
        </p>
        <p className="mt-2 font-medium text-blue-800">
          (Cam kết sản phẩm chất lượng – Hỗ trợ bảo hành đến 20 năm)
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form bên trái */}
        <div className="md:sticky md:top-32 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>

          {error && <div className="mb-4 bg-red-100 text-red-600 px-4 py-2 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setNameError('');
                }}
                className={`w-full mt-1 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                  nameError && !name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  setPhoneError('');
                }}
                className={`w-full mt-1 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                  phoneError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Địa chỉ giao hàng</label>
              <input
                type="text"
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  setAddressError('');
                }}
                className={`w-full mt-1 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                  addressError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Ghi chú</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Đặt hàng
            </button>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Đơn hàng của bạn</h2>

          <div className="space-y-4 mb-6">
            {itemsToDisplay.map((item, index) => {
              const key = makeKey(item.product.id, item.variant?.id);
              const name = `${item.product.name}${item.variant ? ` - ${item.variant.name}` : ''}`;
              const image = item.variant?.image || item.product.image;
              const price = item.variant?.price || item.product.price;
              const originalPrice = item.variant?.originalPrice || item.product.originalPrice;

              return (
                <div
                  key={key}
                  className={`flex items-start pb-4 ${index < itemsToDisplay.length - 1 ? 'border-b' : ''}`}
                >
                  <Image src={image} alt={name} width={80} height={80} className="rounded-lg mr-4 object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{name}</p>
                    <div className="flex items-center space-x-2 my-1">
                      <p className="text-red-600 font-bold">{formatPrice(price)}</p>
                      {originalPrice && (
                        <p className="text-gray-500 line-through text-sm">{formatPrice(originalPrice)}</p>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <p className="font-medium text-gray-600">
                      Số lượng: <span className="font-bold">{item.quantity}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedCartItems.length > initialItemsToShow && (
            <div className="flex justify-center mt-2">
              {!showAllItems ? (
                <button
                  onClick={() => setShowAllItems(true)}
                  className="text-blue-600 font-medium underline flex items-center"
                >
                  và {remainingItemsCount} sản phẩm khác
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              ) : (
                <button
                  onClick={() => setShowAllItems(false)}
                  className="text-blue-600 font-medium underline flex items-center"
                >
                  Thu gọn
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between border-t pt-4">
            <span className="text-lg font-semibold">Tổng cộng: (chưa tính ship)</span>
            <span className="text-xl font-bold text-red-600">
              {formatPrice(getSelectedTotalPrice())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
