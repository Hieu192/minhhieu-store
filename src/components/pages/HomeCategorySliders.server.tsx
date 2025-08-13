// app/components/pages/HomeCategorySliders.server.tsx
import CategorySlider from './CategorySlider'; // Giữ riêng component Client có animation
import { getCategories, getProductsByCategory } from '@/lib/api';
import { Category } from '@/types/category';

export default async function HomeCategorySliders({ categoriesTree, categories }: { categoriesTree: Category[] , categories: Category[] }) {
  // const categories = await getCategories();

  const productsByCategory = await Promise.all(
    categories.map(async (cat: Category) => {
      const products = await getProductsByCategory(cat.slug);
      const categoryInTree = categoriesTree.find((c) => c.id === cat.id);
      const subCategories = categoryInTree?.children || [];
      return { slug: cat.slug, name: cat.name, id: cat.id, products, subCategories };
    })
  );

  return (
    <section className="space-y-2 md:space-y-8">
      {productsByCategory.map((cat) =>
        cat.products.length > 0 ? (
          <CategorySlider
            key={cat.id}
            title={cat.name}
            slug={cat.slug}
            products={cat.products}
            subCategories={cat.subCategories}
          />
        ) : null
      )}
    </section>
  );
}
