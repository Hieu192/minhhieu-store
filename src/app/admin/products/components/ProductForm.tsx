'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';

interface ProductFormProps {
  mode: 'add' | 'edit'
  initialData?: any
}

interface ProductFormState {
  id?: string;
  name: string
  brand: string
  originalPrice: string
  price: string
  categoryId: number
  rating: string
  attributes: string
  description: string
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export default function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormState>({
    id: '',
    name: '',
    brand: '',
    originalPrice: '',
    price: '',
    categoryId: 0,
    rating: '0',
    attributes: '',
    description: '',
  })
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [galleryPreview, setGalleryPreview] = useState<string[]>([])
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isCropping, setIsCropping] = useState(false);

  // Load dữ liệu khi ở chế độ 'edit'
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name || '',
        brand: initialData.brand || '',
        originalPrice: initialData.originalPrice?.toString() || '',
        price: initialData.price?.toString() || '',
        categoryId: initialData.categoryId || 0,
        rating: initialData.rating?.toString() || '0',
        attributes: initialData.attributes ? JSON.stringify(initialData.attributes) : '',
        description: initialData.description || '',
      })
      if (initialData.image) setThumbnailPreview(initialData.image)
      if (initialData.gallery) {
        setGalleryPreview(initialData.gallery);
        setExistingGalleryUrls(initialData.gallery);
      }
    }
  }, [mode, initialData])
  
  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch('/api/admin/categories?level=1');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

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

  // const createCroppedImage = () => {
  //   console.log("createCroppedImage called with completedCrop:::");
  //   if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
  //     return;
  //   }
  //   console.log("createCroppedImage called with completedCrop 1:::");

  //   const image = imgRef.current;
  //   const canvas = previewCanvasRef.current;
  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;

  //   const offscreen = new OffscreenCanvas(
  //     completedCrop.width * scaleX,
  //     completedCrop.height * scaleY
  //   );
  //   const ctx = offscreen.getContext('2d');
  //   if (!ctx) return;
  //   console.log("createCroppedImage called with completedCrop 2:::");
  //   ctx.drawImage(
  //     image,
  //     completedCrop.x * scaleX,
  //     completedCrop.y * scaleY,
  //     completedCrop.width * scaleX,
  //     completedCrop.height * scaleY,
  //     0,
  //     0,
  //     completedCrop.width * scaleX,
  //     completedCrop.height * scaleY
  //   );

  //   offscreen.convertToBlob({ type: 'image/jpeg', quality: 0.9 }).then((blob) => {
  //     const croppedFile = new File([blob], "thumbnail.jpg", { type: 'image/jpeg' });
  //     setThumbnailFile(croppedFile);
  //     setThumbnailPreview(URL.createObjectURL(croppedFile));
  //     setIsCropping(false); // Tắt chế độ cắt ảnh sau khi đã xử lý
  //   });

  //   console.log("createCroppedImage called with completedCrop 3:::");
  // };

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
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      
      setGalleryFiles((prev) => [...prev, ...newFiles]);
      setGalleryPreview((prev) => [...prev, ...newPreviews]);
    }
  }

  const removeGalleryImage = (index: number) => {
    const isFile = index >= existingGalleryUrls.length;
    
    if (isFile) {
      const fileIndex = index - existingGalleryUrls.length;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    } else {
      setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
    }
    
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('brand', form.brand)
    formData.append('originalPrice', form.originalPrice)
    formData.append('price', form.price)
    formData.append('categoryId', form.categoryId.toString())
    formData.append('rating', form.rating)
    formData.append('attributes', form.attributes)
    formData.append('description', form.description)

    // Xử lý ảnh thumbnail
    if (thumbnailFile) {
      formData.append('image', thumbnailFile);
    } else if (mode === 'edit' && initialData.image) {
      formData.append('image_url', initialData.image);
    }

    // Xử lý ảnh gallery
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formData.append('gallery_files', file)
      })
    }
    
    // Gửi các URL ảnh cũ còn lại
    existingGalleryUrls.forEach((url) => {
      formData.append('gallery_urls', url);
    })

    try {
      const apiEndpoint = mode === 'add' ? '/api/admin/products' : `/api/admin/products/${form.id}`;
      const method = mode === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(apiEndpoint, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const product = await res.json();
      setSuccess(`Sản phẩm ${product.name} đã được ${mode === 'add' ? 'thêm' : 'cập nhật'} thành công!`);

      console.log("formData::::", Object.fromEntries(formData.entries()))
      router.refresh();
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-80 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'add' ? '➕ Thêm sản phẩm mới' : '✏️ Chỉnh sửa sản phẩm'}
      </h1>

      {success && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block mb-1">Tên sản phẩm</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1">Thương hiệu</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Giá gốc</label>
            <input
              type="number"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Giá đã giảm</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">Danh mục</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
            required
          >
            <option value={0}>-- Chọn danh mục --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
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
                <img src={thumbnailPreview} alt="Thumbnail" className="mt-2 h-32 w-32 rounded-lg object-cover" />
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

        {/* Gallery */}
        <div>
          <label className="block mb-1">Bộ sưu tập ảnh</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full" />
          <div className="mt-2 flex flex-wrap gap-2">
            {galleryPreview.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`Gallery ${idx}`} className="h-24 w-24 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1">Đánh giá (0-5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
          />
        </div>

        {/* Attributes */}
        <div>
          <label className="block mb-1">Thuộc tính (JSON)</label>
          <textarea
            name="attributes"
            value={form.attributes}
            onChange={handleChange}
            rows={3}
            placeholder='Ví dụ: {"màu": "đen", "bộ nhớ": "128GB"}'
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none font-mono"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Mô tả (HTML)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="<p>...</p>"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none font-mono"
          />
        </div>

        {form.description && (
          <div className="bg-white/20 p-4 rounded-lg border border-white/30">
            <h3 className="font-semibold mb-2">📄 Xem trước mô tả:</h3>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.description }} />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
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