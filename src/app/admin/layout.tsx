// src/app/admin/layout.tsx
import { Inter } from 'next/font/google'
import '../globals.css' // Import Tailwind từ globals.css chính
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard - My Store',
  description: 'Admin management panel',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}>
        <AdminAuthProvider>
          <AdminSidebar/>
          <main className="flex-1 p-2">{children}</main>
        </AdminAuthProvider>
      </body>
    </html>
  )
}