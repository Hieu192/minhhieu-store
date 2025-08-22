// src/app/api/admin/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Xóa cookie bằng cách set maxAge = 0
    const response = NextResponse.json(
      { message: 'Đăng xuất thành công' },
      { status: 200 }
    )

    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Xóa cookie
    })

    return response
  } catch (error) {
    console.error('[Logout API Error]', error)
    return NextResponse.json(
      { error: 'Không thể đăng xuất' },
      { status: 500 }
    )
  }
}
