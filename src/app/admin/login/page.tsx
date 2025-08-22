// src/app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAdminAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submitting login form with data:', formData)
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(formData.email, formData.password)
      console.log('Login success:', success)
      if (success) {
        router.push('/admin')
      } else {
        setError('Thông tin đăng nhập không chính xác!')
      }
    } catch {
      setError('Đã xảy ra lỗi, vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo + Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">🛍️</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-purple-200">Đăng nhập để quản lý cửa hàng</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@mystore.com"
                required
                className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-purple-200 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 bg-white/90 border-white/30 rounded focus:ring-purple-300 focus:ring-2"
                />
                <span className="ml-2">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm text-purple-300 hover:text-purple-100 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:translate-y-0 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-sm font-medium text-purple-200 mb-1">Thông tin demo:</h3>
            <p className="text-xs text-purple-300">Email: admin@mystore.com</p>
            <p className="text-xs text-purple-300">Password: admin123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-purple-300 text-sm">
          © 2025 My Store. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  )
}
