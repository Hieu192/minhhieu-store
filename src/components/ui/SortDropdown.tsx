'use client';

import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const priceOptions = [
  { value: 'price-low', label: 'Giá thấp → cao' },
  { value: 'price-high', label: 'Giá cao → thấp' },
];

const otherOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'name', label: 'Tên A-Z' },
  { value: 'rating', label: 'Đánh giá cao' },
];

// Combine all options for the single dropdown on mobile
const allOptions = [
  ...otherOptions,
  ...priceOptions, // Add price options at the end or beginning as you prefer
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  // Find the selected option for display in the combined dropdown
  const selectedOptionForCombinedDropdown = allOptions.find((o) => o.value === value) || { label: 'Sắp xếp' };

  // Find the selected price option for the separate price dropdown on desktop
  const selectedPrice = priceOptions.find((o) => o.value === value);


  return (
    <div className="flex items-center gap-2 flex-wrap text-sm w-full">

      {/* Các nút sắp xếp riêng lẻ (chỉ hiện trên PC) */}
      <div className="hidden md:flex items-center gap-2 flex-wrap"> {/* Hidden on mobile, flex on md+ */}
        <span className="text-gray-700">Sắp xếp theo:</span> {/* Keep this for PC view */}
        {otherOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1 border transition ${
              value === option.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}

        {/* Dropdown chỉ cho Giá (chỉ hiện trên PC) */}
        <Listbox value={selectedPrice?.value || ''} onChange={onChange}>
          <div className="relative">
            <Listbox.Button
              className={`px-3 py-1 w-48 border flex items-center justify-between transition ${
                value.startsWith('price')
                  ? 'bg-white text-blue-600 border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {selectedPrice ? selectedPrice.label : 'Giá'}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-48 bg-white border rounded shadow-md z-50">
              {priceOptions.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `px-4 py-2 cursor-pointer ${
                      active ? 'bg-blue-100' : ''
                    }`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Dropdown chung cho Mobile */}
      {/* Thay đổi: Sử dụng flex để chữ "Sắp xếp theo:" và dropdown nằm cùng hàng */}
      <div className="md:hidden flex items-center gap-2 w-full"> {/* Only visible on mobile, hidden on md+ */}
        <span className="text-gray-700 whitespace-nowrap">Sắp xếp theo:</span> {/* whitespace-nowrap để tránh xuống dòng */}
        <Listbox value={value} onChange={onChange}>
          <div className="relative flex-grow"> {/* flex-grow để dropdown chiếm hết không gian còn lại */}
            <Listbox.Button
              className={`px-3 py-1 w-full border flex items-center justify-between transition ${
                value
                  ? 'bg-white text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {selectedOptionForCombinedDropdown.label}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow-md z-50">
              {allOptions.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active, selected }) =>
                    `px-4 py-2 cursor-pointer ${
                      active ? 'bg-blue-100' : ''
                    } ${
                      selected ? 'font-semibold text-blue-600' : 'text-gray-900'
                    }`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    </div>
  );
}