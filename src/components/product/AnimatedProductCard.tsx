// components/product/AnimatedProductCard.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function AnimatedProductCard({ product, onAddToCart }: Props) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* <ProductCard product={product} onAddToCart={onAddToCart} /> */}
      <ProductCard product={product} />
    </motion.div>
  );
}
