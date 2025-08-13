'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

// Omit width & height để không cho phép truyền vào
interface Props extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
  src?: string;
  alt: string;
}

export default function SafeImage({ src, alt, ...rest }: Props) {
  const fallbackImage = '/images/no-image-available.png';
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);

  return (
    <div className="relative w-full aspect-square overflow-hidden">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        draggable={false}
        loading="lazy"
        className="object-contain"
        onError={() => setImgSrc(fallbackImage)}
        onLoadingComplete={(img) => {
          if (img.naturalWidth === 0) {
            setImgSrc(fallbackImage);
          }
        }}
        {...rest} // ✅ Lúc này sẽ không còn width/height lọt xuống
      />
    </div>
  );
}
