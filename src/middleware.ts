// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, JWTPayload } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (e) {
    console.error('JWT verify failed:', e)
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  console.log('Middleware pathname:::', pathname)
  // Bỏ qua các route public
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/admin/auth/login') ||
    pathname.startsWith('/api/admin/auth/register')
  ) {
    return NextResponse.next()
  }

  // Lấy token từ cookie
  const token = req.cookies.get('admin_token')?.value
  console.log('Token:::', token)
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Nếu là admin route thì check role
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
