import { category } from "@prisma/client";

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number | null;
  attributes: Record<string, string>;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string; // ✅ thêm trường slug
  price: number;
  originalPrice?: number | null;
  image: string;
  category: category;
  brand: string;
  rating: number;
  reviews: number;
  badges?: string[];
  description?: string | null;
  attributes?: Record<string, string> | null;
  gallery: string[]; // Thêm trường gallery để chứa ảnh phụ
  variants: ProductVariant[];
}
