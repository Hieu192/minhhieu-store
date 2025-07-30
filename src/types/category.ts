export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  level: number;
  parentId: string | null;
  children: Category[];
}
