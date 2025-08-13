// src/components/Pagination.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // Base URL for pagination links, e.g., '/news', or '/news/category-slug'
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const pageRange = 2; // Số trang hiển thị ở mỗi bên trang hiện tại

  // Logic mới để tạo mảng phân trang
  const startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, currentPage + pageRange);

  // Thêm trang đầu tiên và dấu ba chấm nếu cần
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  // Thêm các trang trong khoảng giữa
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Thêm dấu ba chấm và trang cuối cùng nếu cần
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex flex-wrap justify-center space-x-2">
        {/* Nút "Trước" */}
        {currentPage > 1 && (
          <li className="mb-4">
            <Link
              href={`${baseUrl}${currentPage - 1 === 1 ? '' : `/page/${currentPage - 1}`}`}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Trước
            </Link>
          </li>
        )}

        {/* Các nút số trang */}
        {pages.map((page, index) => (
          <li key={index} className="mb-4">
            {page === '...' ? (
              <span className="px-4 py-2 text-gray-700">...</span>
            ) : (
              <Link
                href={`${baseUrl}${page === 1 ? '' : `/page/${page}`}`}
                className={`px-4 py-2 border rounded-md ${
                  page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Nút "Sau" */}
        {currentPage < totalPages && (
          <li className="mb-4">
            <Link
              href={`${baseUrl}/page/${currentPage + 1}`}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Sau
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
