const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

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

const defaultCategoryImage =
  'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753242796/ecommerce/categories/AVA-copy_uz3bcf.jpg';

// slugify tiếng Việt
const slugify = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

// Tạo variants cho product
function generateVariants(productId, count = 3) {
  const variants = [];

  for (let i = 0; i < count; i++) {
    const price = faker.number.int({ min: 500_000, max: 10_000_000 });
    const originalPrice = price + faker.number.int({ min: 50_000, max: 500_000 });

    variants.push({
      productId,
      name: `Phiên bản ${i + 1}`,
      price,
      originalPrice,
      stock: faker.number.int({ min: 0, max: 100 }),
      attributes: {
        KichThuoc: `${faker.number.int({ min: 300, max: 800 })}x${faker.number.int({
          min: 300,
          max: 800,
        })}mm`,
        MauSac: faker.color.human(),
        ChatLieu: faker.commerce.productMaterial(),
      },
    });
  }

  return variants;
}

// Tạo product (chưa gắn variant)
function generateProduct(categoryId, index) {
  const name = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`;
  const slug = `${slugify(name)}-${index}`;

  return {
    name,
    slug,
    brand: faker.company.name(),
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviews: faker.number.int({ min: 1, max: 50 }),
    image:
      'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753237435/ecommerce/products/inax-AC-902VN-CW-S32VN-BW1-1090x1090_ziywym.webp',
    gallery: [
      'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753237435/ecommerce/products/inax-AC-902VN-CW-S32VN-BW1-1090x1090_ziywym.webp',
      'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753238578/bon-cau-1-khoi-cao-cap-ttcera-bc005-6001625895793_jsjyb3.jpg',
      'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753246269/ecommerce/products/bon-cau-1-khoi-cao-cap-ttcera-bc005-6021625895793_klyxwi.jpg',
      'https://res.cloudinary.com/dh2zcmzaf/image/upload/v1753246281/ecommerce/products/bon-cau-1-khoi-cao-cap-ttcera-bc005-6011625895793_wuktwx.jpg',
    ],
    description: faker.commerce.productDescription(),
    categoryId,
    price: 0,
    originalPrice: 0,
  };
}

async function main() {
  let productIndex = 0;

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

    if (children.length === 0) {
      for (let i = 0; i < 5; i++) {
        const productData = generateProduct(parent.id, productIndex++);
        const product = await prisma.product.create({ data: productData });

        const variants = generateVariants(product.id, faker.number.int({ min: 2, max: 4 }));
        await prisma.productVariant.createMany({ data: variants });

        // Lấy variant có price thấp nhất
        const minVariant = variants.reduce((prev, curr) =>
          curr.price < prev.price ? curr : prev
        );

        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: minVariant.price,
            originalPrice: minVariant.originalPrice,
          },
        });
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

      for (let i = 0; i < 5; i++) {
        const productData = generateProduct(child.id, productIndex++);
        const product = await prisma.product.create({ data: productData });

        const variants = generateVariants(product.id, faker.number.int({ min: 2, max: 4 }));
        await prisma.productVariant.createMany({ data: variants });

        const minVariant = variants.reduce((prev, curr) =>
          curr.price < prev.price ? curr : prev
        );

        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: minVariant.price,
            originalPrice: minVariant.originalPrice,
          },
        });
      }
    }
  }
}

main()
  .then(() => {
    console.log('✅ Seed hoàn tất (products + variants, giá/giá gốc theo variant rẻ nhất).');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
