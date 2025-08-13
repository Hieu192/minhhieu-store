// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export async function getCategories() {
  const res = await fetch(`${API_BASE}/api/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function getCategoriesTree() {
  const res = await fetch(`${API_BASE}/api/categories/tree`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories tree');
  return res.json();
}

export async function getProductsByCategory(slug: string) {
  const res = await fetch(`${API_BASE}/api/products/category/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch products for category ${slug}`);
  return res.json();
}

export async function getFeaturedProducts() {
  const res = await fetch(`${API_BASE}/api/products/featured`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch featured products');
  return res.json();
}

