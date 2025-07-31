// types/post.ts (Ví dụ file định nghĩa Type)
export type Post = {
  id: number;
  title: string;
  slug: string;
  image: string;
  summary: string;
  date: string;
  category: string;
  content: string; // Thêm trường content
};