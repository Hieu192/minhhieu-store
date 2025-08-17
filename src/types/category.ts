export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  level: number;
  parentId: number | null;
  children: Category[];
  description: string | null;
}
