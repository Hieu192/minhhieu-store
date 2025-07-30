'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function SafeImage(props: ImageProps) {
  const { src, alt, ...rest } = props;
  const fallbackImage = '/images/no-image-available.png'; // Đường dẫn đến ảnh thay thế
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      loading="lazy"
      // width={width}
      // height={height}
      className="object-cover"
      onError={() => setImgSrc(fallbackImage)} // ⚠️ Không có tác dụng
      onLoadingComplete={(img) => {
        // Nếu ảnh không load được (bị lỗi), naturalWidth sẽ là 0
        if (img.naturalWidth === 0) {
          setImgSrc(fallbackImage);
        }
      }}      
      {...rest}
    />
  );
}
