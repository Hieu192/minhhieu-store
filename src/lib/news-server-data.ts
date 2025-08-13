// lib/news-server-data.ts
import { prisma } from './prisma';
import { createCategorySlug } from '../ultis/helps'; // Import helper

const POSTS_PER_PAGE = 5; // Cần dùng cùng giá trị với API

// Hàm lấy tất cả categories duy nhất từ DB
export async function getAllCategoriesForStatic(): Promise<string[]> {
  const categories = await prisma.news.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });
  const categoryNames = categories.map(c => c.category);
  return categoryNames.sort();
}

// Hàm lấy bài viết có phân trang và lọc theo category từ DB (cho mục đích tính totalPages)
export async function getPostsForStatic(options?: { categorySlug?: string; page?: number; limit?: number }): Promise<{
  posts: { category: string; slug: string }[]; // Chỉ cần các trường cần thiết cho generateStaticParams
  totalPosts: number;
  totalPages: number;
}> {
  const { categorySlug, page = 1, limit = POSTS_PER_PAGE } = options || {};

  const whereClause: any = {};

  if (categorySlug) {
    const categoryName = (await getAllCategoriesForStatic()).find(cat => createCategorySlug(cat) === categorySlug);
    if (categoryName) {
      whereClause.category = categoryName;
    } else {
      return { posts: [], totalPosts: 0, totalPages: 0 };
    }
  }

  const totalPosts = await prisma.news.count({ where: whereClause });
  const totalPages = Math.ceil(totalPosts / limit);

  const posts = await prisma.news.findMany({
    where: whereClause,
    select: {
        slug: true,
        category: true
    }
  });


  return {
    posts: posts,
    totalPosts,
    totalPages,
  };
}


// Hàm để tạo params cho generateStaticParams của trang danh mục (chỉ category slug)
export async function getAllCategorySlugsForStatic(): Promise<{ categorySlug: string }[]> {
  const categories = await getAllCategoriesForStatic();
  return categories.map(cat => ({
    categorySlug: createCategorySlug(cat),
  }));
}

// Hàm để tạo params cho generateStaticParams của trang tổng news/page/[page]
export async function getAllNewsPageSlugsForStatic(): Promise<{ page: string }[]> {
  const { totalPages } = await getPostsForStatic();
  const paths = [];
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ page: i.toString() });
  }
  return paths;
}

// Hàm để tạo params cho generateStaticParams của trang news/[categorySlug]/page/[page]
export async function getAllCategoryPaginatedSlugsForStatic(): Promise<{ categorySlug: string; page: string }[]> {
  const paths: { categorySlug: string; page: string }[] = [];
  const categories = await getAllCategoriesForStatic();

  for (const categoryName of categories) {
    const categorySlug = createCategorySlug(categoryName);
    const { totalPages: categoryTotalPages } = await getPostsForStatic({ categorySlug });
    for (let i = 2; i <= categoryTotalPages; i++) {
      paths.push({ categorySlug, page: i.toString() });
    }
  }
  return paths;
}

// Hàm để tạo params cho generateStaticParams của trang chi tiết bài viết
export async function getAllPostSlugsForDetailStatic(): Promise<{ categorySlug: string; articleSlug: string }[]> {
  const allNews = await prisma.news.findMany({
    select: {
      slug: true,
      category: true,
    },
  });

  return allNews.map(post => ({
    categorySlug: createCategorySlug(post.category),
    articleSlug: post.slug,
  }));
}

// Hàm lấy bài viết theo slug từ DB (cho generateMetadata)
export async function getPostBySlugForStatic(slug: string) {
  const post = await prisma.news.findUnique({
    where: { slug: slug },
    select: {
        title: true,
        summary: true,
        image: true,
        category: true,
        date: true,
        content: true,
    }
  });
  return post;
}