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

interface Variant {
  id?: string
  name: string
  originalPrice?: number | string
  price: number| string
  stock?: number| string
  // backend nhận object; mình lưu thêm trường UI _attributesText để edit
  attributes?: any
  _attributesText?: string
  _attrError?: string
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

  const [variants, setVariants] = useState<Variant[]>([])
  
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

  const [isCropping, setIsCropping] = useState(false);

  // Helpers cho attributes JSON
  const toAttrText = (attr: any) => {
    if (typeof attr === 'string') return attr
    try { return JSON.stringify(attr ?? {}, null, 2) } catch { return '{}' }
  }
  const safeParseOrString = (text: string) => {
    try {
      const obj = JSON.parse(text)
      return (obj && typeof obj === 'object') ? obj : {}
    } catch {
      // Trả về string để user tiếp tục sửa; không làm hỏng controlled value
      return text
    }
  }

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
      if (initialData.variants) {
        const mapped: Variant[] = initialData.variants.map((v: any) => ({
          ...v,
          attributes: v.attributes ?? {},
          _attributesText: toAttrText(v.attributes ?? {}),
          _attrError: undefined,
        }))
        setVariants(mapped)
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

  const hasVariants = variants.length > 0;

  // --- Sửa useEffect xử lý tự động cập nhật giá từ variants
  useEffect(() => {
    if (variants.length === 0) {
      // Không overwrite giá product-level khi không có biến thể.
      // Giữ nguyên giá hiện tại để user có thể nhập.
      return;
    }

    // Có biến thể -> tìm variant rẻ nhất
    const cheapestVariant = variants.reduce((min, v) => {
      const vPrice = Number(v.price ?? Infinity);
      return vPrice < (Number(min.price ?? Infinity)) ? v : min;
    }, variants[0]);

    setForm(f => ({
      ...f,
      // Nếu cheapestVariant có giá thì ghi; nếu không thì giữ giá hiện tại (f.price)
      price: cheapestVariant?.price !== undefined ? String(cheapestVariant.price) : f.price,
      originalPrice: cheapestVariant?.originalPrice !== undefined ? String(cheapestVariant.originalPrice) : f.originalPrice,
    }));
  }, [variants]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ================= Variants =================
  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    // Gõ số rỗng -> NaN, xử lý về 0 hoặc giữ chuỗi
    if (['price', 'originalPrice', 'stock'].includes(field as string)) {
      newVariants[index] = { ...newVariants[index], [field]: value === '' ? 0 : Number(value) };
    } else {
      newVariants[index] = { ...newVariants[index], [field]: value };
    }
    setVariants(newVariants);
  }

  const handleVariantAttrTextChange = (index: number, text: string) => {
    const next = [...variants]
    // thử parse để báo lỗi realtime
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === 'object') {
        next[index].attributes = parsed
        next[index]._attrError = undefined
      } else {
        next[index]._attrError = 'JSON phải là một object'
      }
    } catch {
      // khi đang gõ chưa hợp lệ -> lưu text, set lỗi
      next[index].attributes = text
      next[index]._attrError = 'JSON không hợp lệ'
    }
    next[index]._attributesText = text
    setVariants(next)
  }

  const addVariant = () => {
    setVariants(v => [
      ...v,
      { name: '', originalPrice: '', price: '', stock: '', attributes: {}, _attributesText: '{\n}', _attrError: undefined }
    ]);
  }

  const duplicateVariant = (index: number) => {
    const v = variants[index]
    setVariants(prev => [
      ...prev.slice(0, index + 1),
      { ...v, id: undefined }, // tránh giữ id cũ
      ...prev.slice(index + 1),
    ])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  }

  // ================= Image =================
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
    const c = makeAspectCrop(
      { unit: '%', width: 90 },
      ASPECT_RATIO,
      width,
      height,
    );
    const centeredCrop = centerCrop(c, width, height);
    setCrop(centeredCrop);
  };

  const createCroppedImage = () => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

  const validateForm = (product: ProductFormState, variants: Variant[]) => {
    const errors: string[] = [];

    if (variants.length === 0) {
      // Không có biến thể → product price là bắt buộc
      if (!product.price || product.price === '') {
        errors.push("Giá sản phẩm là bắt buộc");
      }
      if (!product.originalPrice || product.originalPrice === '') {
        if (product.price && product.price > product.originalPrice) {
          errors.push("Giá bán không được cao hơn giá gốc sản phẩm");
        }
      }
    } else {
      // Có biến thể → validate từng variant
      variants.forEach((v, index) => {
        if (!v.name || v.name.trim() === '') {
          errors.push(`Tên biến thể #${index + 1} là bắt buộc`);
        }
        if (!v.price || v.price === '' || Number(v.price) <= 0) {
          errors.push(`Giá biến thể #${index + 1} là bắt buộc`);
        }
        if (!v.originalPrice || v.originalPrice === '' || Number(v.originalPrice) <= 0) {
          errors.push(`Giá gốc biến thể #${index + 1} là bắt buộc`);
        }
        if (!v.stock || v.stock === '' || Number(v.stock) < 0) {
          errors.push(`Tồn kho biến thể #${index + 1} là bắt buộc`);
        }
        if (v.originalPrice && v.price && Number(v.price) > Number(v.originalPrice)) {
          errors.push(`Giá bán không được cao hơn giá gốc biến thể #${index + 1}`);
        }
      });
    }

    return errors;
  };


  // ================= Submit =================
  const handleSubmit = async (e: FormEvent) => {
    const errors = validateForm(form, variants);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Chuẩn hóa variants: bỏ trường UI, ensure attributes là object
    const variantsPayload = variants.map(({ _attributesText, _attrError, ...v }) => {
      let attrs = v.attributes
      if (typeof attrs === 'string') {
        const parsed = safeParseOrString(attrs)
        attrs = typeof parsed === 'string' ? {} : parsed
      }
      return { ...v, attributes: attrs }
    })

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('brand', form.brand)
    formData.append('originalPrice', form.originalPrice)
    formData.append('price', form.price)
    formData.append('categoryId', form.categoryId.toString())
    formData.append('rating', form.rating)
    formData.append('attributes', form.attributes)
    formData.append('description', form.description)
    formData.append('variants', JSON.stringify(variantsPayload))

    if (thumbnailFile) {
      formData.append('image', thumbnailFile);
    } else if (mode === 'edit' && initialData?.image) {
      formData.append('image_url', initialData.image);
    }

    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formData.append('gallery_files', file)
      })
    }
    existingGalleryUrls.forEach((url) => {
      formData.append('gallery_urls', url);
    })

    try {
      const apiEndpoint = mode === 'add' ? '/api/admin/products' : `/api/admin/products/${form.id}`;
      const method = mode === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(apiEndpoint, { method, body: formData, credentials: 'include', });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const product = await res.json();
      setSuccess(`Sản phẩm ${product.name} đã được ${mode === 'add' ? 'thêm' : 'cập nhật'} thành công!`);

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

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-6">
        {/* Name & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Variants - Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-base font-semibold">Biến thể sản phẩm</label>
            <button type="button" onClick={addVariant} className="px-3 py-1.5 bg-purple-600 rounded-lg">+ Thêm biến thể</button>
          </div>

          {variants.length === 0 && (
            <div className="p-4 rounded-xl border border-dashed border-white/20 text-sm text-white/70">
              Chưa có biến thể nào. Nhấn <b>+ Thêm biến thể</b> để bắt đầu.
            </div>
          )}

          <div className="space-y-4">
            {variants.map((variant, idx) => (
              <div key={idx} className="rounded-2xl border border-white/15 bg-white/5 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">{idx + 1}</span>
                    <span className="font-semibold">{variant.name || 'Biến thể mới'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => duplicateVariant(idx)} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15">Nhân bản</button>
                    <button type="button" onClick={() => removeVariant(idx)} className="px-2 py-1 text-xs rounded bg-red-500/80 hover:bg-red-500">Xóa</button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block mb-1 text-sm">Tên biến thể</label>
                      <input
                        placeholder="VD: 8GB/128GB - Đen"
                        value={variant.name}
                        onChange={e => handleVariantChange(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Giá gốc</label>
                      <input
                        type="number"
                        placeholder="originalPrice"
                        value={variant.originalPrice}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} 
                        onChange={e => handleVariantChange(idx, 'originalPrice', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Giá bán</label>
                      <input
                        type="number"
                        placeholder="price"
                        value={variant.price}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} 
                        onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Tồn kho (stock)</label>
                      <input
                        type="number"
                        placeholder="stock"
                        value={variant.stock}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} 
                        onChange={e => handleVariantChange(idx, 'stock', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Thuộc tính (JSON)</label>
                    <textarea
                      rows={5}
                      placeholder='Ví dụ: {"màu":"đen","ram":"8GB"}'
                      value={variant._attributesText ?? toAttrText(variant.attributes)}
                      onChange={(e) => handleVariantAttrTextChange(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 focus:outline-none font-mono"
                    />
                    {variant._attrError && (
                      <p className="mt-1 text-xs text-red-300">{variant._attrError}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prices (auto từ biến thể) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Giá gốc {hasVariants ? '(lấy từ biến thể thấp nhất)' : ''}</label>
            <input
              type="number"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              readOnly={hasVariants}
              disabled={hasVariants}
              onWheel={(e) => (e.target as HTMLInputElement).blur()} 
              className={`w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 ${hasVariants ? 'cursor-not-allowed' : ''}`}
            />
            {hasVariants && (
              <p className="text-xs mt-1 text-white/60">
                Giá tự động lấy từ biến thể rẻ nhất. Để thay đổi, chỉnh sửa hoặc xóa biến thể.
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">Giá bán {hasVariants ? '(lấy từ biến thể thấp nhất)' : ''}</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              readOnly={hasVariants}
              disabled={hasVariants}
              onWheel={(e) => (e.target as HTMLInputElement).blur()} 
              className={`w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 ${hasVariants ? 'cursor-not-allowed' : ''}`}
            />
            {hasVariants && (
              <p className="text-xs mt-1 text-white/60">
                Giá tự động lấy từ biến thể rẻ nhất. Để thay đổi, chỉnh sửa hoặc xóa biến thể.
              </p>
            )}
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
              <option key={category.id} value={category.id} className='text-black'>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block mb-1">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full" />
          {thumbnailPreview && (
            <div className="mt-2">
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
                <img src={thumbnailPreview} alt="Thumbnail" className="mt-2 h-32 w-32 rounded-lg object-cover" />
              )}
              
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
                <img src={src} alt={`Gallery ${idx}`} className="h-24 w-24 rounded-lg object-contain" />
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
            onWheel={(e) => (e.target as HTMLInputElement).blur()} 
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none"
          />
        </div>

        {/* Attributes (product-level) */}
        <div>
          <label className="block mb-1">Thuộc tính sản phẩm (JSON)</label>
          <textarea
            name="attributes"
            value={form.attributes}
            onChange={handleChange}
            rows={3}
            placeholder='Ví dụ: {"dòng":"Pro","bảo hành":"12 tháng"}'
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
