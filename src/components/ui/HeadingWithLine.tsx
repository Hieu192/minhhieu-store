// components/HeadingWithLine.tsx

import React from 'react';

// Định nghĩa kiểu cho props của component HeadingWithLine
interface HeadingWithLineProps {
  children: React.ReactNode; // children có thể là bất kỳ thứ gì có thể render được trong React (string, JSX, array of JSX, etc.)
  className?: string;       // className là tùy chọn, kiểu string
}

const HeadingWithLine: React.FC<HeadingWithLineProps> = ({ children, className }) => {
  return (
    <h2 className={`
      flex items-center text-center
      text-2xl md:text-3xl font-bold
      mb-8 md:mb-12
      ${className || ''}
    `}>
      <span className="flex-grow border-b border-gray-300 mr-4"></span> {/* Đường kẻ trái */}
      <span className="whitespace-nowrap">{children}</span> {/* Chữ tiêu đề, tránh xuống dòng */}
      <span className="flex-grow border-b border-gray-300 ml-4"></span> {/* Đường kẻ phải */}
    </h2>
  );
};

export default HeadingWithLine;