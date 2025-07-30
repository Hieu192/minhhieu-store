'use client';

import Link from 'next/link';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingContactButtons() {
  const [scrollPercent, setScrollPercent] = useState(0);

  // Hiện nút "Lên đầu" khi cuộn xuống
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrollTop / docHeight) * 100;
      setScrollPercent(Math.min(percent, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    // Circle settings
  const radius = 22;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (scrollPercent / 100) * circumference;

  return (
    <div className="fixed right-2 md:right-4 bottom-2 md:bottom-12 z-50 flex flex-col items-center space-y-3">
      {/* Zalo */}
      <div className="ripple-wrapper flex">
        <Link
          href="https://zalo.me/0828190203"
          target="_blank"
          className="relative z-10 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-100"
        >
          <img
            src="/images/zalo.png"
            alt="Zalo"
            className="w-6 h-6 md:w-8 md:h-8 icon-bounce"
          />
        </Link>
      </div>

      {/* Facebook */}
      <div className="ripple-wrapper hidden md:flex">
        <Link
          href="https://www.facebook.com/hieu.pham.389609"
          target="_blank"
          className="relative z-10 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-100"
        >
          <img
            src="/images/facebook.png"
            alt="Facebook"
            className="w-8 h-8 icon-bounce"
          />
        </Link>
      </div>

      {/* Messenger */}
      <div className="ripple-wrapper flex">
        <Link
          href="https://m.me/hieu.pham.389609"
          target="_blank"
          className="relative z-10 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-100"
        >
          <img
            src="/images/messenger.png"
            alt="Messenger"
            className="w-6 h-6 md:w-8 md:h-8 icon-bounce"
          />
        </Link>
      </div>

      {/* Gọi điện */}
      <div className="ripple-wrapper hidden md:flex">
        <a
          href="tel:0123456789"
          className="relative z-10 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-100"
        >
          <Phone className="text-green-600 w-8 h-8 icon-bounce" />
        </a>
      </div>

      {/* Nút lên đầu với vòng tròn tiến độ */}
      {scrollPercent > 2 && (
        <button
          onClick={scrollToTop}
          className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition flex items-center justify-center"
          title="Lên đầu trang"
        >
          {/* Vòng tròn tiến độ SVG cho mobile */}
          <svg
            className="absolute top-0 left-0 w-full h-full block md:hidden"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              strokeDasharray={Math.PI * 2 * 20}
              strokeDashoffset={Math.PI * 2 * 20 * (1 - scrollPercent / 100)}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
              style={{ transition: 'stroke-dashoffset 0.2s ease-out' }}
            />
          </svg>

          {/* Vòng tròn tiến độ SVG cho desktop */}
          <svg
            className="absolute top-0 left-0 hidden md:block"
            viewBox="0 0 56 56"
          >
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#ccc"
              strokeWidth={stroke}
              fill="none"
              transform="rotate(-90 28 28)"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#3b82f6"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
              style={{ transition: 'stroke-dashoffset 0.2s ease-out' }}
            />
          </svg>

          {/* Icon mũi tên */}
          <ArrowUp className="w-6 h-6 md:w-8 md:h-8 text-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </button>
      )}

    </div>
  );
}
