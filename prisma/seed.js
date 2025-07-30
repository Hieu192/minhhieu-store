const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// Danh sách danh mục cha và con
const rawCategories = {
  'Bồn cầu': ['1 khối', '2 khối', 'trứng', 'thông minh'],
  'Sen cây': ['nóng', 'lạnh'],
  'Sen tắm': ['nóng', 'lạnh'],
  'bàn đá': ['đen', 'trắng'],
  'vòi lavabo': ['nóng', 'lạnh'],
  'lavabo': [],
  'tủ lavabo': [],
  'gương lavabo': [],
  'chậu chén': [],
  'vòi rửa chén': [],
  'gạch lát nền': ['60x60', '80x80', '100x100'],
  'gạch dán tường': ['60x60', '80x80', '100x100'],
};

const defaultCategoryImage = 'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753242796/ecommerce/categories/AVA-copy_uz3bcf.jpg';

// Tạo slug từ tên
const slugify = (text) => {
  return text
    .normalize('NFD') // loại dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

// Tạo product mẫu
function generateProductsForCategory(categoryId, count = 5) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`;
    const slug = faker.helpers.slugify(name.toLowerCase());
    const price = faker.number.int({ min: 500_000, max: 10_000_000 });
    const originalPrice = price + faker.number.int({ min: 100_000, max: 1_000_000 });
    const brand = faker.company.name();
    const rating = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));
    const reviews = faker.number.int({ min: 1, max: 50 });

    products.push({
      name,
      slug,
      price,
      originalPrice,
      brand,
      rating,
      reviews,
      image: 'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753237435/ecommerce/products/inax-AC-902VN-CW-S32VN-BW1-1090x1090_ziywym.webp',
      gallery: [
        "https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753237435/ecommerce/products/inax-AC-902VN-CW-S32VN-BW1-1090x1090_ziywym.webp",
        "https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753238578/bon-cau-1-khoi-cao-cap-ttcera-bc005-6001625895793_jsjyb3.jpg",
        "https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753246269/ecommerce/products/bon-cau-1-khoi-cao-cap-ttcera-bc005-6021625895793_klyxwi.jpg",
        "https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753246281/ecommerce/products/bon-cau-1-khoi-cao-cap-ttcera-bc005-6011625895793_wuktwx.jpg"
      ],
      description: faker.commerce.productDescription(),
      attributes: {
        KichThuoc: `${faker.number.int({ min: 400, max: 800 })}x${faker.number.int({ min: 400, max: 800 })}mm`,
        MauSac: faker.color.human(),
        ChatLieu: faker.commerce.productMaterial(),
      },
      badges: faker.helpers.shuffle(['Bán chạy', 'Mới', 'Giảm giá', 'Ưa chuộng']).slice(0, faker.number.int({ min: 0, max: 2 })),
      categoryId,
    });
  }

  return products;
}

async function main() {
  const parentMap = {};

  for (const [parentName, children] of Object.entries(rawCategories)) {
    const parentSlug = slugify(parentName);

    const parent = await prisma.category.upsert({
      where: { slug: parentSlug },
      update: {},
      create: {
        name: parentName,
        slug: parentSlug,
        level: 0,
        image: defaultCategoryImage,
      },
    });

    parentMap[parentName] = parent;

    // Nếu không có con, vẫn tạo sản phẩm cho parent
    if (children.length === 0) {
      const products = generateProductsForCategory(parent.id, 6);
      for (const p of products) {
        await prisma.product.create({ data: p });
      }
    }

    for (const childName of children) {
      const fullName = `${parentName} ${childName}`;
      const fullSlug = slugify(`${parentSlug} ${childName}`);

      const child = await prisma.category.upsert({
        where: { slug: fullSlug },
        update: {},
        create: {
          name: fullName,
          slug: fullSlug,
          parentId: parent.id,
          level: 1,
          image: defaultCategoryImage,
        },
      });

      const products = generateProductsForCategory(child.id, 6);
      for (const p of products) {
        await prisma.product.create({ data: p });
      }
    }
  }
}

main()
  .then(() => {
    console.log('✅ Seed hoàn tất.');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
