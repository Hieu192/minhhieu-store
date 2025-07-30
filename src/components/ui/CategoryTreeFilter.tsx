'use client'

import { useState } from 'react'
import { Category } from '@/types/category';
import { capitalizeWords } from '@/ultis/helps';

interface Props {
  categoriesTree: Category[]
  selectedCategory: string
  setSelectedCategory: (slug: string) => void
  updateQueryParam: (key: string, value: string | null) => void
}

export default function CategoryTreeFilter({
  categoriesTree,
  selectedCategory,
  setSelectedCategory,
  updateQueryParam,
}: Props) {
  const [openIds, setOpenIds] = useState<number[]>([])

  const toggleOpen = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSelect = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory('all')
      updateQueryParam('category', null)
    } else {
      setSelectedCategory(slug)
      updateQueryParam('category', slug)
    }
  }

  const renderCategory = (category: Category, level = 0, isLastParent = false) => {
    const isOpen = openIds.includes(category.id)
    const hasChildren = category.children.length > 0
    const isSelected = selectedCategory === category.slug

    return (
      <div
        key={category.id}
        className={`space-y-1 ${!isLastParent ? 'border-b' : ''}`}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSelect(category.slug)}
            className={`text-sm px-2 py-1 rounded w-full text-left transition ${
              isSelected
                ? 'bg-gray-200 text-gray-800 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            {level === 0
              ? category.name.toUpperCase()
              : capitalizeWords(category.name)}
          </button>
          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleOpen(category.id)}
              className="text-xl text-black hover:text-black"
            >
              {isOpen ? '−' : '+'}
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="ml-4 border-l">
            {category.children.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }


  return (
    <div className='border-b pb-4 '>
      <h3 className="font-semibold mb-2">Tất Cả Danh Mục</h3>
      <button
        onClick={() => {
          setSelectedCategory('all')
          updateQueryParam('category', null)
        }}
        className={`block w-full text-left px-2 py-1 rounded text-sm border-b transition ${
          selectedCategory === 'all'
            ? 'bg-gray-200 text-gray-800 font-medium'
            : 'hover:bg-gray-100'
        }`}
      >
        TẤT CẢ SẢN PHẨM
      </button>

      <div className="space-y-1 mt-2">
        {categoriesTree.map((category, index) =>
          renderCategory(category, 0, index === categoriesTree.length - 1)
        )}
      </div>
    </div>
  )
}
