// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect admin routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check for admin authentication token (you can implement your own logic)
    const adminToken = request.cookies.get('admin_token')
    
    if (!adminToken) {
      // Redirect to admin login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (path === '/admin/login') {
    const adminToken = request.cookies.get('admin_token')
    
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}