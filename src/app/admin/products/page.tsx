'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent } from 'react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  brand: string 
  category: { name: string }
  gallery: string[]
  status: 'Published' | 'Archived' | 'Draft'
}

interface Pagination {
  totalProducts: number
  totalPages: number
  currentPage: number
  limit: number
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Published' | 'Archived' | 'Draft'>('All'); // Thêm state cho status
  const [categories, setCategories] = useState<Category[]>([]);

  // Lấy danh sách sản phẩm
  // const fetchProducts = async (page: number, term: string, categoryId: number | '', status: string) => {
  //   setLoading(true)
  //   setError(null)
  //   try {
  //     // Xây dựng URL với các tham số tìm kiếm và lọc
  //     let url = `/api/admin/products?page=${page}&limit=${limit}`;
  //     if (term) {
  //       url += `&search=${encodeURIComponent(term)}`;
  //     }
  //     if (categoryId) {
  //       url += `&categoryId=${categoryId}`;
  //     }
  //     if (status !== 'All') { // Thêm điều kiện lọc theo status
  //       url += `&status=${status}`;
  //     }

  //     const res = await fetch(url, { cache: 'no-store' })
  //     if (!res.ok) {
  //       throw new Error('Failed to fetch products')
  //     }
  //     const data = await res.json()
  //     setProducts(data.products)
      
  //     setTotalPages(data.pagination.totalPages);
  //     setCurrentPage(data.pagination.currentPage);
  //     setLimit(data.pagination.limit);

  //   } catch (err: any) {
  //     console.error('Error fetching products:', err)
  //     setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories?level=1');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Gọi hàm fetchProducts mỗi khi currentPage, debouncedSearchTerm, selectedCategory hoặc selectedStatus thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Xây dựng URL với các tham số tìm kiếm và lọc
        let url = `/api/admin/products?page=${currentPage}&limit=${limit}`;
        if (debouncedSearchTerm) {
          url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
        }
        if (selectedCategory) {
          url += `&categoryId=${selectedCategory}`;
        }
        if (selectedStatus !== 'All') {
          url += `&status=${selectedStatus}`;
        }

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
        setLimit(data.pagination.limit);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearchTerm, selectedCategory, selectedStatus, limit]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchClick = () => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value === '' ? '' : Number(e.target.value));
    setCurrentPage(1);
  };
  
  // Hàm xử lý khi thay đổi trạng thái
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as 'All' | 'Published' | 'Archived' | 'Draft');
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete product');
      }
      // Cập nhật lại danh sách sản phẩm sau khi xóa
      setProducts(products.filter(product => product.id !== productId));
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  return (
    <div className="ml-80 p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Quản lý sản phẩm</h1>
        <button
          onClick={() => router.push('/admin/products/add')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          ➕ Thêm sản phẩm
        </button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        />
        <button
          onClick={handleSearchClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Tìm kiếm
        </button>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <p>Đang tải danh sách sản phẩm...</p>
      ) : error ? (
        <p className="text-red-500">Lỗi: {error}</p>
      ) : (
        <>
          {/* Bảng sản phẩm */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden mb-6">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10 text-left">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Ảnh</th>
                  <th className="px-4 py-4">Thư viện</th>
                  <th className="px-4 py-4">Tên sản phẩm</th>
                  <th className="px-4 py-4">Danh mục</th>
                  <th className="px-4 py-4">Giá</th>
                  <th className="px-4 py-4">Trạng thái</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5">
                    <td className="px-4 py-4">{product.id}</td>
                    <td className="px-4 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        {product.gallery.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">{product.name}</td>
                    <td className="px-4 py-4">{product.category.name}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="line-through text-gray-400 mr-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="text-green-400 font-semibold">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                        product.status === 'Archived' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                      >
                        Sửa
                      </button>
                      <button 
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-end items-center space-x-2 text-sm">
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </div>
  )
}
