'use client'

import React from 'react'
import { ExamCategory } from '@/types'
import { EXAM_CATEGORY_LABELS, formatPrice } from '@/lib/utils'
import { Search, RotateCcw } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface CourseFiltersProps {
  selectedCategory: ExamCategory | ''
  onCategoryChange: (category: ExamCategory | '') => void
  search: string
  onSearchChange: (search: string) => void
  minPrice: number
  maxPrice: number
  onPriceChange: (min: number, max: number) => void
  onReset: () => void
}

const CATEGORIES: { id: ExamCategory; label: string }[] = [
  { id: 'civil_service', label: 'Civil Service (UPSC / State PSC)' },
  { id: 'public_banking', label: 'Public Banking (IBPS, SBI)' },
  { id: 'railway', label: 'Railway (RRB NTPC, Group D)' },
  { id: 'municipal', label: 'Municipal & State Bodies' },
]

export default function CourseFilters({
  selectedCategory,
  onCategoryChange,
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
}: CourseFiltersProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Filters</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="label">Search keyword</label>
        <Input
          placeholder="e.g. UPSC Prelims, Reasoning..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftElement={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Exam Category */}
      <div>
        <label className="label">Exam Category</label>
        <div className="space-y-2 mt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
            <input
              type="radio"
              name="examCategory"
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <span>All Categories</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
              <input
                type="radio"
                name="examCategory"
                checked={selectedCategory === cat.id}
                onChange={() => onCategoryChange(cat.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="label mb-0">Max Price</label>
          <span className="text-xs font-bold text-primary-600">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={10000}
          step={500}
          value={maxPrice}
          onChange={(e) => onPriceChange(0, Number(e.target.value))}
          className="w-full accent-primary-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹10,000</span>
        </div>
      </div>
    </div>
  )
}
