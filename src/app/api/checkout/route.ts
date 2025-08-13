// app/api/checkout/route.ts
import { saveOrderToDatabase } from '@/lib/checkout';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Gửi đến Discord webhook
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🛒 **Đơn hàng mới từ ${data.name}**\n📞 ${data.phone}\n🏠 ${data.address}\n📝 ${data.note}\n\n${data.items.map((item: any) =>
          `• ${item.name} x${item.quantity} - ${item.price}₫`).join('\n')}\n\n**Tổng cộng:** ${data.total}₫`,
      }),
    });

    // Lưu vào database
    await saveOrderToDatabase(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ success: false, message: 'Lỗi khi xử lý đơn hàng' }, { status: 500 });
  }
}
