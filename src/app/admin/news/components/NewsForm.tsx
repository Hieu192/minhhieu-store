'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react'
import { NewsStatus } from '@prisma/client'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';

// Giao diện cho props của component, xác định chế độ 'add' hoặc 'edit'.
interface NewsFormProps {
  mode: 'add' | 'edit'
  initialData?: any
}

// Giao diện cho state của form, bao gồm các trường dữ liệu của một bài viết tin tức.
interface NewsFormState {
  id?: string
  title: string
  category: string
  summary: string
  content: string
  isFeatured: boolean
}

const ASPECT_RATIO = 5/3;
const MIN_DIMENSION = 150;

export default function NewsForm({ mode, initialData }: NewsFormProps) {
  const router = useRouter()
  // Khởi tạo state của form với các giá trị mặc định.
  const [form, setForm] = useState<NewsFormState>({
    id: '',
    title: '',
    category: '',
    summary: '',
    content: '',
    isFeatured: false,
  })
  
  // State để quản lý tệp tin ảnh đại diện.
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  // State để quản lý các URL xem trước ảnh.
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  
  // State để xử lý trạng thái loading, lỗi và thông báo thành công.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // State để lưu trữ danh sách danh mục fetched từ API.
  const [categories, setCategories] = useState<any[]>([])

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Sử dụng useEffect để tải dữ liệu ban đầu khi ở chế độ 'edit'.
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        id: initialData.id,
        title: initialData.title || '',
        category: initialData.category || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
        isFeatured: initialData.isFeatured || false,
      })
      // Cập nhật URL xem trước ảnh đại diện.
      if (initialData.image) setThumbnailPreview(initialData.image)
    }
  }, [mode, initialData])
  

  // Xử lý thay đổi các trường input, textarea, select.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  // Xử lý thay đổi ảnh đại diện.
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setCrop(undefined);
      setCompletedCrop(undefined);
      setIsCropping(true);
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop(
      { unit: '%', width: 90 },
      ASPECT_RATIO,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const createCroppedImage = () => {
    if (!completedCrop || !imgRef.current) {
        return;
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return;
    }

    ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
    );

    // Chuyển đổi canvas thành Blob và cập nhật state
    canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], "thumbnail.jpg", { type: 'image/jpeg' });
        setThumbnailFile(croppedFile);
        setThumbnailPreview(URL.createObjectURL(croppedFile));
        setIsCropping(false);
    }, 'image/jpeg', 0.9);
  };

  // Xử lý sự kiện submit form.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('category', form.category)
    formData.append('summary', form.summary)
    formData.append('content', form.content)
    formData.append('isFeatured', form.isFeatured.toString())

    // Xử lý ảnh thumbnail
    if (thumbnailFile) {
      formData.append('image', thumbnailFile);
    } else if (mode === 'edit' && initialData.image) {
      formData.append('image_url', initialData.image);
    }

    try {
      // Xác định endpoint API và phương thức dựa trên chế độ ('add' hoặc 'edit').
      const apiEndpoint = mode === 'add' ? '/api/admin/news' : `/api/admin/news/${form.id}`;
      const method = mode === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(apiEndpoint, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save news article');
      }

      const newsArticle = await res.json();
      setSuccess(`Bài viết "${newsArticle.title}" đã được ${mode === 'add' ? 'thêm' : 'cập nhật'} thành công!`);

      router.refresh();
      // Chuyển hướng sau khi lưu thành công.
      setTimeout(() => {
        router.push('/admin/news');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving news article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-80 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'add' ? '➕ Thêm bài viết mới' : '✏️ Chỉnh sửa bài viết'}
      </h1>

      {success && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block mb-1">Tiêu đề bài viết</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">Danh mục</label>
          {/* <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          >
            <option value={0}>-- Chọn danh mục --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select> */}
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block mb-1">Tóm tắt</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            placeholder='Tóm tắt ngắn gọn về bài viết...'
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none font-sans"
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block mb-1">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full" />
          {/* {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Thumbnail" className="mt-2 h-32 rounded-lg object-cover" />
          )} */}
          {thumbnailPreview && (
            <div className="mt-2">
              {/* Chỉ hiển thị công cụ cắt khi isCropping là true */}
              {isCropping ? (
                <div className="relative flex justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={ASPECT_RATIO}
                    minWidth={MIN_DIMENSION}
                    minHeight={MIN_DIMENSION}
                  >
                    <img
                      ref={imgRef}
                      src={thumbnailPreview}
                      alt="Crop me"
                      onLoad={onImageLoad}
                      className="max-w-full"
                    />
                  </ReactCrop>
                </div>
              ) : (
                // Hiển thị ảnh xem trước khi đã xử lý hoặc ảnh cũ
                <img src={thumbnailPreview} alt="Thumbnail" className="mt-2 h-32 object-cover" />
              )}
              
              {/* Nút "Cắt ảnh" chỉ xuất hiện khi đã có vùng cắt hoàn chỉnh */}
              {isCropping && completedCrop && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={createCroppedImage}
                    className="ml-4 px-4 py-2 bg-purple-600 rounded-lg text-white"
                  >
                    Cắt ảnh
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1">Nội dung (HTML)</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={6}
            placeholder="<p>...</p>"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none font-mono"
          />
        </div>

        {form.content && (
          <div className="bg-white/20 p-4 rounded-lg border border-white/30">
            <h3 className="font-semibold mb-2">📄 Xem trước nội dung:</h3>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
          </div>
        )}

        {/* Status and Featured */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="text-gray-200 font-medium">Bài viết nổi bật</label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  )
}
