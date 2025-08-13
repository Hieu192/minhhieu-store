// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

import { prisma } from '@/lib/prisma';

interface OrderItemInput {
  id: number;      // productId
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderInput {
  name: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItemInput[];
  total: number;
}

export async function saveOrderToDatabase(order: OrderInput) {
  return await prisma.order.create({
    data: {
      name: order.name,
      phone: order.phone,
      address: order.address,
      note: order.note,
      total: order.total,
      items: {
        create: order.items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      },
    },
  });
}
