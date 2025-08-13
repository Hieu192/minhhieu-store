'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddCategoryPage() {
  const router = useRouter()
  const [parentCategories, setParentCategories] = useState<{ id: number; name: string }[]>([])
  const [form, setForm] = useState({
    name: '',
    level: '',
    parentId: '',
    description: '',
    thumbnail: null as File | null,
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Gọi API khi chọn cấp
  useEffect(() => {
    const fetchParents = async () => {
      if (form.level === '1' || form.level === '2') {
        const parentLevel = form.level === '1' ? 0 : 1
        // Reset trước khi fetch
        setParentCategories([])
        try {
          const res = await fetch(`/api/admin/categories?level=${parentLevel}`, {
            cache: 'no-store', // tránh cache
          })
          if (!res.ok) throw new Error('Lỗi fetch danh mục cha')
          const data = await res.json()
          setParentCategories(Array.isArray(data) ? data : [])
        } catch (err) {
          console.error('Lỗi lấy danh mục cha:', err)
          setParentCategories([])
        }
      } else {
        setParentCategories([]) // Không có danh mục cha khi là cấp 0
      }
    }

    fetchParents()
  }, [form.level])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'level' ? { parentId: '' } : {}),
    }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, thumbnail: file }))
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('level', form.level)
      if (form.parentId) formData.append('parentId', form.parentId)
      formData.append('description', form.description)
      if (form.thumbnail) formData.append('image', form.thumbnail)

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Thêm danh mục thất bại')
      }

      router.push('/admin/categories')
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra khi thêm danh mục!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ml-80 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">➕ Thêm danh mục</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4"
      >
        {/* Tên danh mục */}
        <div>
          <label className="block mb-1">Tên danh mục</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

        {/* Cấp */}
        <div>
          <label className="block mb-1">Cấp</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none text-black"
            required
          >
            <option value="">-- Chọn cấp --</option>
            <option value="0">Cấp 0</option>
            <option value="1">Cấp 1</option>
            <option value="2">Cấp 2</option>
          </select>
        </div>

        {/* Danh mục cha */}
        {(form.level === '1' || form.level === '2') && (
          <div>
            <label className="block mb-1">
              Danh mục cha ({form.level === '1' ? 'Cấp 0' : 'Cấp 1'})
            </label>
            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none text-black"
              required
            >
              <option value="">-- Chọn danh mục cha --</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Thumbnail */}
        <div>
          <label className="block mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white
              hover:file:bg-purple-700"
          />
          {thumbnailPreview && (
            <div className="mt-3">
              <p className="text-sm mb-1">Xem trước:</p>
              <img src={thumbnailPreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
          />
        </div>

        {/* Preview mô tả */}
        {form.description && (
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <p className="text-sm mb-1">Xem trước mô tả:</p>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: form.description }}
            />
          </div>
        )}

        {/* Nút */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            {loading ? 'Đang lưu...' : 'Thêm'}
          </button>
        </div>
      </form>
    </div>
  )
}
