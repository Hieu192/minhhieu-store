'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { capitalizeWords } from '@/ultis/helps';

interface Category {
  id: number;
  name: string;
  slug: string;
  children: Category[];
}

interface Props {
  categories: Category[];
}

export default function CategoryDropdownTree({ categories }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => {
        setDropdownOpen(false);
        setOpenIndex(null);
      }}
    >
      <button className="flex items-center text-sm gap-1 font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
        DANH MỤC SẢN PHẨM <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 bg-white shadow-lg border rounded-md z-50"
          >
            <div className="min-w-[220px] divide-y">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setOpenIndex(index)}
                  onMouseLeave={() => setOpenIndex(null)}
                >
                  <Link
                    href={`/${cat.slug}`}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                  >
                    <span>{cat.name.toUpperCase()}</span>
                    {cat.children.length > 0 && (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </Link>

                  {/* Dropdown con có animation */}
                  <AnimatePresence>
                    {openIndex === index && cat.children.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 left-full bg-white border shadow-lg min-w-[200px] z-50"
                      >
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/${child.slug}`}
                            className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                          >
                            {capitalizeWords(child.name)}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
