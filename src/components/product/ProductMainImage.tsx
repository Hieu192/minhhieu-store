import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';

export default function ProductMainImage({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  const handleArrowClick = (dir: number) => {
    if (!product?.gallery || isExiting) return;
    const nextIndex = (currentIndex + dir + product.gallery.length) % product.gallery.length;
    setDirection(dir);
    setPendingIndex(nextIndex);
    setIsExiting(true);
  };

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex || isExiting) return;
    setDirection(index > currentIndex ? 1 : -1);
    setPendingIndex(index);
    setIsExiting(true);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow">
        <AnimatePresence
          mode="wait"
          custom={direction}
          onExitComplete={() => {
            if (pendingIndex !== null) {
              setCurrentIndex(pendingIndex);
              setPendingIndex(null);
              setIsExiting(false);
            }
          }}
        >
          <motion.img
            key={currentIndex}
            src={product?.gallery?.[currentIndex] ?? ''}
            alt={product.name}
            className="w-full h-full object-contain absolute"
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';
            }}
          />
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={() => handleArrowClick(-1)}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow z-10"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <button
          onClick={() => handleArrowClick(1)}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow z-10"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Thumbnail images */}
      <div className="mt-3 flex justify-center gap-2">
        {product?.gallery?.map((img, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`w-16 h-16 border rounded-md overflow-hidden ${
              index === currentIndex ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
