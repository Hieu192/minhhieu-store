'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { NewsStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'

// Định nghĩa interface cho đối tượng News để khớp với dữ liệu API
interface NewsItem {
  id: number
  title: string
  slug: string
  image: string
  summary: string
  content: string
  date: string
  category: string
  isFeatured: boolean
  views: number
  status: NewsStatus
}

// Định nghĩa interface cho đối tượng Pagination
interface Pagination {
  totalNews: number
  totalPages: number
  currentPage: number
  limit: number
}

// Định nghĩa interface cho form dữ liệu cập nhật
interface NewsForm {
  title: string
  slug: string
  image: string
  summary: string
  content: string
  category: string
  isFeatured: boolean
  status: NewsStatus
}

export default function AdminNews() {
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State mới cho phân trang
  const [pagination, setPagination] = useState<Pagination>({
    totalNews: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
  })

  // State mới cho input tìm kiếm và state riêng để gọi API
  const [searchInputValue, setSearchInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // State cho modal chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [editFormData, setEditFormData] = useState<NewsForm | null>(null)

  // Hàm fetch dữ liệu từ API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = new URL('/api/admin/news', window.location.origin)
        url.searchParams.append('page', pagination.currentPage.toString())
        url.searchParams.append('limit', pagination.limit.toString())
        if (selectedCategory !== 'all') {
          url.searchParams.append('category', selectedCategory)
        }
        if (selectedStatus !== 'all') {
          url.searchParams.append('status', selectedStatus)
        }
        if (searchQuery) {
          url.searchParams.append('search', searchQuery)
        }

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu bài viết.')
        }

        const result = await response.json()
        
        // Kiểm tra dữ liệu trả về trước khi cập nhật state
        if (result && result.news && result.pagination) {
          setNews(result.news)
          setPagination(result.pagination)
        } else {
          throw new Error('Cấu trúc dữ liệu trả về từ API không hợp lệ.')
        }

      } catch (e) {
        if (e instanceof Error) {
          console.error('Lỗi khi tải bài viết:', e)
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }
    
    // Chỉ gọi API khi các filter hoặc search query thay đổi
    fetchNews()
  }, [
    pagination.currentPage,
    pagination.limit,
    selectedCategory,
    selectedStatus,
    searchQuery,
  ])

  // Hàm xử lý khi nhấn nút tìm kiếm hoặc Enter
  const handleSearchClick = () => {
    setSearchQuery(searchInputValue)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Hàm xử lý lưu thay đổi
  const handleSave = async () => {
    if (!selectedNews || !editFormData) return

    try {
      const response = await fetch(`/api/admin/news?id=${selectedNews.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật bài viết.')
      }

      // Cập nhật lại danh sách bài viết sau khi chỉnh sửa thành công
      const updatedNewsItem = await response.json()
      setNews(news.map(item => item.id === selectedNews.id ? updatedNewsItem : item))
      setShowEditModal(false)
    } catch (e) {
      if (e instanceof Error) {
        console.error('Lỗi khi cập nhật bài viết:', e)
        setError(e.message)
      }
    }
  }

  // Hàm xử lý xóa bài viết
  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xóa bài viết.')
      }
      
      // Cập nhật lại danh sách bài viết
      setNews(news.filter(item => item.id !== id))
    } catch (e) {
      if (e instanceof Error) {
        console.error('Lỗi khi xóa bài viết:', e)
        setError(e.message)
      }
    }
  }

  const getStatusBadge = (status: NewsStatus) => {
    const statusColors: Record<NewsStatus, string> = {
      'Published': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Archived': 'bg-gray-100 text-gray-800',
      'Pending': 'bg-purple-100 text-purple-800', 
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: NewsStatus) => {
    const statusTexts: Record<NewsStatus, string> = {
      'Published': 'Đã xuất bản',
      'Draft': 'Nháp',
      'Archived': 'Lưu trữ',
      'Pending': 'Đang chờ',
    }
    return statusTexts[status] || status
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      
      <main className="flex-1 ml-80 p-8">
        {/* Header and Add New Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Quản lý tin tức</h1>
          <button
            onClick={() => router.push('/admin/news/add')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
          >
            ➕ Tạo bài viết mới
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleSearchClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Tìm kiếm
            </button>
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all" className='text-black'>Tất cả danh mục</option>
            {/* Thêm các option danh mục từ dữ liệu thực tế */}
            <option value="" className='text-black'>Công nghệ</option>
            <option value="doi-song" className='text-black'>Đời sống</option>
            <option value="tin-tuc-chung" className='text-black'>Tin tức chung</option>
          </select>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all" className='text-black'>Tất cả trạng thái</option>
            <option value="Published" className='text-black'>Đã xuất bản</option>
            <option value="Draft" className='text-black'>Nháp</option>
            <option value="Archived" className='text-black'>Lưu trữ</option>
            <option value="Pending" className='text-black'>Đang chờ</option>
          </select>
        </div>

        {/* News Table */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-800 text-xl">Đang tải dữ liệu bài viết...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-600 text-xl">{error}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-600 text-xl">Không tìm thấy bài viết nào.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Tổng số bài viết ({pagination.totalNews})
                </h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full bg-white rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">ID</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Tiêu đề</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Danh mục</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Trạng thái</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Ngày đăng</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Lượt xem</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wide">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-purple-600">{item.id}</td>
                        <td className="py-4 px-6 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</td>
                        <td className="py-4 px-6">{item.category}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="py-4 px-6">{item.views}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => router.push(`/admin/news/edit/${item.id}`)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center">
                <p className="text-gray-700 text-sm">
                  Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalNews)} của {pagination.totalNews} bài viết
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-700 rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-700 rounded disabled:opacity-50"
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedNews && editFormData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Chỉnh sửa bài viết #{selectedNews.id}
                </h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    id="title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-gray-700 font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    id="slug"
                    value={editFormData.slug}
                    onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block text-gray-700 font-medium mb-1">URL Hình ảnh</label>
                  <input
                    type="text"
                    id="image"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="summary" className="block text-gray-700 font-medium mb-1">Tóm tắt</label>
                  <textarea
                    id="summary"
                    rows={3}
                    value={editFormData.summary}
                    onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="content" className="block text-gray-700 font-medium mb-1">Nội dung</label>
                  <textarea
                    id="content"
                    rows={10}
                    value={editFormData.content}
                    onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Danh mục</label>
                  <input
                    type="text"
                    id="category"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-gray-700 font-medium mb-1">Trạng thái</label>
                  <select
                    id="status"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as NewsStatus })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="Published">Đã xuất bản</option>
                    <option value="Draft">Nháp</option>
                    <option value="Archived">Lưu trữ</option>
                    <option value="Pending">Đang chờ</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editFormData.isFeatured}
                    onChange={(e) => setEditFormData({ ...editFormData, isFeatured: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="text-gray-700 font-medium">Bài viết nổi bật</label>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-xl font-medium transition-all duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-6 rounded-xl font-medium transition-all duration-300"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
