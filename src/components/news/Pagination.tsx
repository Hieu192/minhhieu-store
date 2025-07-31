// components/Pagination.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // Base URL for pagination links, e.g., '/news', or '/news/category-slug'
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) {
    return null; // Không hiển thị phân trang nếu chỉ có 1 trang
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        {currentPage > 1 && (
          <li>
            <Link
              href={`${baseUrl}${currentPage - 1 === 1 ? '' : `/page/${currentPage - 1}`}`} // Trang 1 không có /page/1
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Trước
            </Link>
          </li>
        )}

        {pages.map(page => (
          <li key={page}>
            <Link
              href={`${baseUrl}${page === 1 ? '' : `/page/${page}`}`} // Trang 1 không có /page/1
              className={`px-4 py-2 border rounded-md ${
                page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
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