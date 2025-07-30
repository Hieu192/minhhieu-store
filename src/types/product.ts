import { category } from "@prisma/client";

export interface Product {
  id: number;
  name: string;
  slug: string; // ✅ thêm trường slug
  price: number;
  originalPrice?: number;
  image: string;
  category: category;
  brand: string;
  rating: number;
  reviews: number;
  badges: string[];
  description: string;
  attributes: Record<string, string>;
  gallery: string[]; // Thêm trường gallery để chứa ảnh phụ
}
