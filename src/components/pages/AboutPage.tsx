'use client';

import { ShoppingCart, Star, User } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Về BuildMart</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi là đơn vị hàng đầu trong việc cung cấp thiết bị xây dựng và trang trí nội thất chất lượng cao.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="/api/placeholder/600/400"
              alt="Về chúng tôi"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
            <p className="text-gray-600 mb-4">
              Được thành lập từ năm 2010, BuildMart đã trở thành một trong những thương hiệu uy tín
              trong lĩnh vực cung cấp vật liệu xây dựng và thiết bị trang trí nội thất.
            </p>
            <p className="text-gray-600 mb-4">
              Với hơn 15 năm kinh nghiệm, chúng tôi hiểu rõ nhu cầu của khách hàng và luôn
              nỗ lực mang đến những sản phẩm chất lượng nhất với giá cả hợp lý.
            </p>
            <p className="text-gray-600">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ khách hàng
              tìm ra giải pháp tối ưu cho không gian sống của mình.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chất lượng cao</h3>
            <p className="text-gray-600">Sản phẩm được tuyển chọn kỹ lưỡng từ các thương hiệu uy tín</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
            <p className="text-gray-600">Cam kết giao hàng trong vòng 24-48h tại TP.HCM</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
