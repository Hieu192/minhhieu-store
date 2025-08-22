import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/admin/auth/register
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và password là bắt buộc" },
        { status: 400 }
      );
    }

    // Check đã tồn tại admin chưa
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Admin đã tồn tại với email này" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const admin = await prisma.user.create({
      data: {
        email,
        name: name || "Admin",
        password: hashedPassword,
        role: "admin", // cố định role = admin
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ admin });
  } catch (err: any) {
    console.error("Error register admin:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
