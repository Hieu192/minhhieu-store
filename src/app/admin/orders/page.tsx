'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'


interface ProductItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
}
// Định nghĩa interface cho đối tượng Order
interface Order {
  id: string
  customer: string
  email: string
  phone: string
  products: ProductItem[] 
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderDate: string
  shippingAddress: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Sử dụng useEffect để gọi API khi component được render hoặc trạng thái lọc thay đổi
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        // Cập nhật đường dẫn API để khớp với file route.ts đã cho
        const response = await fetch(`/api/admin/orders?status=${selectedStatus}`) 

        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu đơn hàng.')
        }

        const result = await response.json()

        // Lấy mảng đơn hàng từ thuộc tính 'orders' của đối tượng trả về
        if (result && Array.isArray(result.orders)) {
          setOrders(result.orders)
        } else {
          throw new Error('Dữ liệu trả về từ API không hợp lệ.')
        }

      } catch (e) {
        if (e instanceof Error) {
          console.error("Lỗi khi tải đơn hàng:", e)
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [selectedStatus]) // Thêm selectedStatus vào dependency array để re-fetch khi bộ lọc thay đổi.

  // Các hàm và logic khác giữ nguyên
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái', count: orders.length },
    { value: 'pending', label: 'Chờ xác nhận', count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'Đang giao', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
  ]

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    }
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const statusTexts = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang xử lý',
      'shipped': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    }
    return statusTexts[status as keyof typeof statusTexts] || status
  }

  const getPaymentStatusText = (status: string) => {
    const statusTexts = {
      'pending': 'Chờ thanh toán',
      'paid': 'Đã thanh toán',
      'failed': 'Thanh toán thất bại'
    }
    return statusTexts[status as keyof typeof statusTexts] || status
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // Trong thực tế, bạn sẽ gọi một API để cập nhật trạng thái trên server.
    // Ví dụ:
    // try {
    //   await fetch(`/api/orders/${orderId}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ status: newStatus })
    //   });
    //   // Sau khi API call thành công, cập nhật state local
    //   setOrders(orders.map(order => 
    //     order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    //   ));
    // } catch (error) {
    //   console.error("Failed to update status", error);
    //   // Xử lý lỗi
    // }
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    ))
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      
      <main className="flex-1 ml-80 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quản lý đơn hàng</h1>
          <p className="text-purple-200">Theo dõi và xử lý các đơn hàng</p>
        </div>

        {/* Status Filter Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-white text-xl">Đang tải dữ liệu đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-400 text-xl">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedStatus === option.value
                      ? 'bg-white text-purple-600 shadow-xl scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">{option.count}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Danh sách đơn hàng ({filteredOrders.length})
                </h2>
                <div className="flex gap-2">
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300">
                    Xuất Excel
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300">
                    In báo cáo
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full bg-white rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {/* <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Mã đơn</th> */}
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Khách hàng</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Sản phẩm</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Tổng tiền</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Trạng thái</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Thanh toán</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Ngày đặt</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        {/* <td className="py-4 px-6 font-semibold text-purple-600">{order.id}</td> */}
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-gray-800">{order.customer}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
                            <div className="text-sm text-gray-500">{order.phone}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            {order.products.map((product, index) => (
                              <div key={index} className="text-sm text-gray-600 mb-1">
                                • {product.name} (x{product.quantity})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.paymentStatus)}`}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{order.orderDate}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewDetails(order)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:-translate-y-1"
                            >
                              Chi tiết
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium focus:outline-none"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="processing">Đang xử lý</option>
                              <option value="shipped">Đang giao</option>
                              <option value="delivered">Đã giao</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Chi tiết đơn hàng {selectedOrder.id}
                </h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Họ tên:</span>
                      <p className="text-gray-800 font-medium">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-gray-800">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Số điện thoại:</span>
                      <p className="text-gray-800">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Địa chỉ giao hàng:</span>
                      <p className="text-gray-800">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ngày đặt:</span>
                      <p className="text-gray-800">{selectedOrder.orderDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Thanh toán:</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(selectedOrder.paymentStatus)}`}>
                        {getPaymentStatusText(selectedOrder.paymentStatus)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Tổng tiền:</span>
                      <p className="text-lg font-bold text-purple-600">{formatPrice(selectedOrder.total)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm đã đặt</h4>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name} x {product.quantity}</p>
                            <p className="text-sm text-gray-500">Giá: {product.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300">
                  In đơn hàng
                </button>
                <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300">
                  Gửi email
                </button>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-all duration-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
