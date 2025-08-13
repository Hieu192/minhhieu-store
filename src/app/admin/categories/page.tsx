'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
  level: number
  image?: string | null
  description?: string | null
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<string>('') // State mới cho bộ lọc cấp độ

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      try {
        // Xây dựng URL với tham số level nếu có
        const levelQuery = selectedLevel ? `?level=${selectedLevel}` : ''
        const res = await fetch(`/api/admin/categories${levelQuery}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [selectedLevel]) // Dependency: useEffect sẽ chạy lại khi selectedLevel thay đổi

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value)
  }

  return (
    <div className="ml-80 p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📂 Quản lý danh mục</h1>
        <div className="flex items-center space-x-4">
          {/* Bộ lọc theo cấp độ */}
          <select
            value={selectedLevel}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none text-sm text-black"
          >
            <option value="">Tất cả cấp</option>
            <option value="0">Cấp 0</option>
            <option value="1">Cấp 1</option>
            <option value="2">Cấp 2</option>
          </select>
          <button
            onClick={() => router.push('/admin/categories/add')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            ➕ Thêm danh mục
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Thumbnail</th>
                <th className="px-6 py-4 text-left">Tên danh mục</th>
                <th className="px-6 py-4 text-left">Cấp</th>
                <th className="px-6 py-4 text-left">Mô tả</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">{cat.id}</td>
                  <td className="px-6 py-4">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4">{cat.level}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{cat.description || ''}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/admin/categories/edit/${cat.id}`)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                    >
                      Sửa
                    </button>
                    <button className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}