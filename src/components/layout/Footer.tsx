'use client';

import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-bold mb-4">MinhHieu</h3>
            <p className="text-gray-400 mb-4">
              Cung cấp thiết bị xây dựng và trang trí nội thất chất lượng cao
              với giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Column 2 */}
          {/* <div>
            <h4 className="font-semibold mb-4">Danh mục</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/categories/thiet-bi-ve-sinh" className="hover:text-white">
                  Thiết bị vệ sinh
                </Link>
              </li>
              <li>
                <Link href="/categories/gach-men" className="hover:text-white">
                  Gạch men
                </Link>
              </li>
              <li>
                <Link href="/categories/thiet-bi-bep" className="hover:text-white">
                  Thiết bị bếp
                </Link>
              </li>
              <li>
                <Link href="/categories/den-trang-tri" className="hover:text-white">
                  Đèn trang trí
                </Link>
              </li>
            </ul>
          </div> */}
          {/* Column 3: Bản đồ */}  
          <div>
            <h4 className="font-semibold mb-4">Bản đồ cửa hàng</h4>
            <div className="aspect-video w-full rounded overflow-hidden border border-gray-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7964133.560852002!2d102.38242348197153!3d12.924612014778653!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dd8f9b7d673%3A0x878a62d377cb53a!2zVGhp4bq_dCBi4buLIHbhu4cgc2luaCBNaW5oIEhp4bq_dQ!5e0!3m2!1svi!2sus!4v1753068459999!5m2!1svi!2sus" 
                width="100%" 
                height="100%" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>258 Bình Long - Phú Thạnh - Tân Phú, TP.HCM</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>0852039338 - 0918446729</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>hieuthptchuyenbl@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}

        </div>

        <div className="border-t border-gray-800 mt-4 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MinhHieu. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
