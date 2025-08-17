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

  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Nếu tổng số trang ít thì hiển thị hết
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      // Gần đầu
      pages.push(1, 2, 3, 4, 5, 6, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Gần cuối
      pages.push(1, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Ở giữa
      pages.push(
        1,
        '...',
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        '...',
        totalPages
      );
    }
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex flex-wrap justify-center space-x-2">
        {/* Nút "Trước" */}
        <li className="mb-4">
          {currentPage > 1 ? (
            <Link
              href={`${baseUrl}${currentPage - 1 === 1 ? '' : `/page/${currentPage - 1}`}`}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Trước
            </Link>
          ) : (
            <span className="px-4 py-2 border rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
              Trước
            </span>
          )}
        </li>

        {/* Các nút số trang */}
        {pages.map((page, index) => (
          <li key={index} className="mb-4">
            {page === '...' ? (
              <span className="px-4 py-2 text-gray-700">...</span>
            ) : (
              <Link
                href={`${baseUrl}${page === 1 ? '' : `/page/${page}`}`}
                className={`px-4 py-2 border rounded-md ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Nút "Sau" */}
        <li className="mb-4">
          {currentPage < totalPages ? (
            <Link
              href={`${baseUrl}/page/${currentPage + 1}`}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Sau
            </Link>
          ) : (
            <span className="px-4 py-2 border rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
              Sau
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
