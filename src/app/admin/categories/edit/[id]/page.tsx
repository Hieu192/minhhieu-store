'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Category {
  id: number
  name: string
  level: number
  parentId: number | null
  description: string | null
  image: string | null
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [form, setForm] = useState({
    name: '',
    level: '',
    parentId: '',
    description: '',
    image: null as File | null,
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parentCategories, setParentCategories] = useState<Category[]>([])

  // Fetch dữ liệu category hiện tại và các danh mục cha
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return
      setLoading(true)
      setError(null)
      try {
        const [categoryRes, parentCatsRes] = await Promise.all([
          fetch(`/api/admin/categories/${categoryId}`),
          fetch(`/api/admin/categories?level=1`),
        ])

        if (!categoryRes.ok || !parentCatsRes.ok) {
          throw new Error('Lỗi khi tải dữ liệu danh mục')
        }

        const categoryData = await categoryRes.json()
        const parentCatsData = await parentCatsRes.json()

        setForm({
          name: categoryData.name,
          level: categoryData.level.toString(),
          parentId: categoryData.parentId ? categoryData.parentId.toString() : '',
          description: categoryData.description || '',
          image: null,
        })
        setThumbnailPreview(categoryData.image)
        setParentCategories(parentCatsData)
      } catch (err: any) {
        console.error('Lỗi khi fetch category:', err)
        setError(err.message || 'Không thể tải dữ liệu danh mục.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [categoryId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm({ ...form, image: file })
      setThumbnailPreview(URL.createObjectURL(file))
    } else {
      setForm({ ...form, image: null })
      // Nếu người dùng xóa file, có thể reset preview về ảnh cũ (nếu có)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('level', form.level)
    formData.append('description', form.description)
    if (form.parentId) {
      formData.append('parentId', form.parentId)
    }

    // Nếu người dùng chọn file ảnh mới, gửi file đó.
    if (form.image) {
      formData.append('image', form.image)
    } else if (thumbnailPreview) {
      // Nếu không chọn file mới nhưng đã có ảnh cũ, gửi URL ảnh cũ
      formData.append('image', thumbnailPreview);
    }
    
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Lỗi khi cập nhật danh mục')
      }

      router.push('/admin/categories')
    } catch (err: any) {
      console.error('Error updating category:', err)
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="ml-80 p-6 text-white text-center">Đang tải dữ liệu...</div>
  }

  if (error && !loading) {
    return <div className="ml-80 p-6 text-red-500 text-center">Lỗi: {error}</div>
  }

  return (
    <div className="ml-80 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">✏️ Chỉnh sửa danh mục</h1>

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
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          >
            <option value="">-- Chọn cấp --</option>
            <option value="1">Cấp 1</option>
            <option value="2">Cấp 2</option>
            <option value="3">Cấp 3</option>
          </select>
        </div>

        {/* Nếu cấp 2 → chọn danh mục cha */}
        {form.level === '2' && (
          <div>
            <label className="block mb-1">Danh mục cha (Cấp 1)</label>
            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
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

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

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
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:bg-gray-500"
            disabled={submitting}
          >
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}