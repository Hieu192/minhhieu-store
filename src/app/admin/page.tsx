// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import StatsCard from '@/components/admin/StatsCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0
  })

  const [recentOrders, setRecentOrders] = useState([
    { id: '#001', customer: 'Nguyen Van A', amount: '2,500,000 VND', status: 'Completed', date: '2025-08-08' },
    { id: '#002', customer: 'Tran Thi B', amount: '1,800,000 VND', status: 'Processing', date: '2025-08-08' },
    { id: '#003', customer: 'Le Van C', amount: '950,000 VND', status: 'Pending', date: '2025-08-07' },
    { id: '#004', customer: 'Pham Thi D', amount: '3,200,000 VND', status: 'Completed', date: '2025-08-07' },
  ])

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalOrders: 1247,
        totalProducts: 89,
        totalUsers: 3456,
        revenue: 125000000
      })
    }, 500)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Completed': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800', 
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    }
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      
      <main className="flex-1 ml-80 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-purple-200">Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng đơn hàng"
            value={stats.totalOrders.toLocaleString()}
            icon="📦"
            trend="+12.5%"
          />
          <StatsCard
            title="Sản phẩm"
            value={stats.totalProducts.toLocaleString()}
            icon="📱"
            trend="+5.2%"
          />
          <StatsCard
            title="Khách hàng"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            trend="+8.1%"
          />
          <StatsCard
            title="Doanh thu"
            value={`${(stats.revenue / 1000000).toFixed(1)}M VND`}
            icon="💰"
            trend="+15.3%"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đơn hàng gần đây</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-600 uppercase text-sm tracking-wide">Mã đơn</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-600 uppercase text-sm tracking-wide">Khách hàng</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-600 uppercase text-sm tracking-wide">Số tiền</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-600 uppercase text-sm tracking-wide">Trạng thái</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-600 uppercase text-sm tracking-wide">Ngày đặt</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-600 uppercase text-sm tracking-wide">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="py-4 px-2 font-semibold text-purple-600">{order.id}</td>
                    <td className="py-4 px-2 text-gray-800">{order.customer}</td>
                    <td className="py-4 px-2 font-semibold text-gray-800">{order.amount}</td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-600">{order.date}</td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-all transform hover:-translate-y-0.5">
                          Xem
                        </button>
                        <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-all transform hover:-translate-y-0.5">
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thống kê nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <div className="text-4xl mb-3">📈</div>
              <div className="text-2xl font-bold text-green-600 mb-1">+23%</div>
              <div className="text-sm text-gray-600">Tăng trưởng tuần này</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl">
              <div className="text-4xl mb-3">⭐</div>
              <div className="text-2xl font-bold text-amber-600 mb-1">4.8</div>
              <div className="text-sm text-gray-600">Đánh giá trung bình</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
              <div className="text-4xl mb-3">🚀</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
              <div className="text-sm text-gray-600">Sản phẩm bán chạy</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}