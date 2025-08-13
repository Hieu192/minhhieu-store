// src/app/admin/components/AdminSidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '🏠'
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: '📱'
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: '📂'
  },
  {
    title: 'Đơn hàng',
    href: '/admin/orders',
    icon: '📦'
  },
  {
    title: 'Khách hàng',
    href: '/admin/customers',
    icon: '👥'
  },
  {
    title: 'Tin tức',
    href: '/admin/news',
    icon: '📰'
  },
  {
    title: 'Báo cáo',
    href: '/admin/reports',
    icon: '📊'
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: '⚙️'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 p-8 overflow-y-auto">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          🛍️ Admin Panel
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl text-white font-medium transition-all duration-300 hover:bg-white/20 hover:translate-x-2 ${
                    isActive ? 'bg-white/20 translate-x-2 shadow-lg' : ''
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-15">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Admin User</div>
            <div className="text-purple-200 text-xs">admin@mystore.com</div>
          </div>
        </div>
        <button 
          onClick={() => {
            // Add logout functionality
            if (typeof window !== 'undefined') {
              localStorage.removeItem('admin_user')
              document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
              window.location.href = '/admin/login'
            }
          }}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 border border-white/20"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}