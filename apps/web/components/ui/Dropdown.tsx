'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string
}

interface DropdownProps {
  options: Option[]
  selected: string
  onSelect: (value: string) => void
  placeholder?: string
}

export default function Dropdown({ options, selected, onSelect, placeholder = 'Select option' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = options.find(o => o.value === selected)

  return (
    <div ref={ref} className="relative inline-block w-full text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span className={current ? 'text-slate-800' : 'text-slate-400'}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 w-full mt-1 bg-white border border-slate-100 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition',
                selected === option.value ? 'bg-primary-50 text-primary-600 font-medium' : 'text-slate-700'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
