// File: src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');

    // Tính toán số lượng bản ghi cần bỏ qua
    const skip = (page - 1) * limit;

    // Tạo điều kiện lọc cho truy vấn Prisma
    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status as OrderStatus;
    }

    // Lấy tổng số đơn hàng phù hợp với điều kiện lọc để tính toán phân trang
    const totalOrders = await prisma.order.count({
      where: whereClause,
    });

    // Lấy danh sách đơn hàng cho trang hiện tại
    const orders = await prisma.order.findMany({
      skip,
      take: limit,
      where: whereClause,
      // Chỉ cần include items, vì tất cả thông tin sản phẩm đã nằm trong đó
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Định dạng dữ liệu để phù hợp với giao diện frontend
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customer: order.name,
      // Tạm thời sử dụng một giá trị mặc định cho email
      email: 'placeholder@email.com', 
      phone: order.phone,
      shippingAddress: order.address,
      // Lấy tên, hình ảnh và số lượng trực tiếp từ OrderItem
      products: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image, // Lấy image trực tiếp từ item
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      orderDate: order.createdAt.toISOString().split('T')[0], // Định dạng ngày
    }));

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/orders] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
