'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Category } from '@/types/category'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
  categories: Category[]
  categoriesTree: Category[]
  children: React.ReactNode
}

export default function PageWrapper({ categories, categoriesTree, children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const [activeParentCategory, setActiveParentCategory] = useState<Category | null>(null)

  const handleClose = () => {
    setIsMenuOpen(false)
    setActiveMenuIndex(0)
    setActiveParentCategory(null)
  }

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100vw'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isMenuOpen])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with slide effect - keep sticky */}
      <Header
        categories={categories}
        categoriesTree={categoriesTree}
        onToggleMobileMenu={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        onHeaderClick={isMenuOpen ? handleClose : undefined}
      />

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen overflow-hidden bg-white shadow-lg transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Slide Wrapper */}
        <div className="relative w-full h-full overflow-hidden overflow-x-hidden">
          {/* Slide 1: Main Menu */}
          <div
            className={`absolute top-0 left-0 w-full h-full overflow-y-auto transition-transform duration-300 ${
              activeMenuIndex === 0 ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="pt-4">
              <div className="text-xl font-bold text-gray-800 border-b pb-4 text-center">
                🏗 BuildMart
              </div>
              {['/', '/products', '/news', '/about', '/contact', '/auth/login'].map((path, i) => (
                <div key={i} className="flex justify-between items-center border-b ml-4">
                  <button
                    onClick={() => {
                      // handleClose()
                      // window.location.href = path
                      if (window.location.pathname + '/products' !== path) {
                        window.location.href = path
                      } else {
                        handleClose()
                      }
                    }}
                    className="flex-1 text-left text-gray-800 font-medium w-full py-3 border-r"
                  >
                    {path === '/' ? 'Trang chủ' :
                      path === '/products' ? 'Sản phẩm' :
                        path === '/news' ? 'Tin tức - Bài viết' :
                          path === '/about' ? 'Về chúng tôi' :
                            path === '/contact' ? 'Liên hệ' :
                              path === '/auth/login' ? 'Đăng nhập' : path}
                  </button>
                  {path === '/products' && (
                    <button
                      onClick={() => setActiveMenuIndex(1)}
                      className="px-3 h-full flex items-center justify-center"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Slide 2: Category Parent */}
          <div
            className={`absolute top-0 left-0 w-full h-full overflow-y-auto transition-transform duration-300 ${
              activeMenuIndex === 1 ? 'translate-x-0' : activeMenuIndex > 1 ? '-translate-x-full' : 'translate-x-full'
            }`} // có thể thêm overscroll-contain touch-pan-y
          >
            <div className="pt-4">
              <div className="flex items-center border-b pb-4">
                <button
                  onClick={() => setActiveMenuIndex(0)}
                  className="text-gray-800 font-medium pl-2 z-50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center font-semibold text-gray-800 -ml-8">
                  Sản phẩm
                </div>
              </div>
              {categoriesTree.map((cat) => (
                <div key={cat.id} className="flex justify-between items-center border-b ml-4">
                  <button
                    onClick={() => {
                      // if (!cat.children?.length) {
                      // handleClose()
                      // window.location.href = `/products?category=${cat.slug}`

                      const targetUrl = `/products?category=${cat.slug}`
                      if (window.location.pathname + window.location.search !== targetUrl) {
                        window.location.href = targetUrl
                      } else {
                        handleClose()
                      }
                    }}
                    className="text-left text-gray-800 font-medium w-full py-3"
                  >
                    {cat.name}
                  </button>
                  {cat.children?.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveParentCategory(cat)
                        setActiveMenuIndex(2)
                      }}
                      className="px-3 h-full flex items-center justify-center border-l py-3"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Slide 3: Category Children */}
          <div
            className={`absolute top-0 left-0 w-full h-full overflow-y-auto transition-transform duration-300 ${
              activeMenuIndex === 2 ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="pt-4">
              <div className="flex items-center border-b pb-4">
                <button
                  onClick={() => setActiveMenuIndex(1)}
                  className="text-gray-800 font-medium z-50 pl-2"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center font-semibold text-gray-800 -ml-8">
                  {activeParentCategory?.name}
                </div>
              </div>
              {activeParentCategory?.children?.map((child) => (
                <div key={child.id} className="border-b ml-4">
                  <button
                    onClick={() => {
                      const targetUrl = `/products?category=${child.slug}`
                      if (window.location.pathname + window.location.search !== targetUrl) {
                        window.location.href = targetUrl
                      } else {
                        handleClose()
                      }
                    }}
                    className="text-left text-gray-800 font-medium w-full py-3"
                  >
                    {child.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Click to close menu */}
      <div 
        className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'translate-x-64 opacity-50' : ''}`}
        onClick={isMenuOpen ? handleClose : undefined}
        style={{ cursor: isMenuOpen ? 'pointer' : 'default' }}
      >
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}