// src/app/api/admin/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }

    const admin = await prisma.user.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ message: 'Admin không tồn tại' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return NextResponse.json({ message: 'Sai mật khẩu' }, { status: 401 })
    }

    // Tạo JWT
    const token = await new SignJWT({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    // Trả response kèm cookie
    const res = NextResponse.json({
      message: 'Đăng nhập thành công',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    })

    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    })

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
  }
}
