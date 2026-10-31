'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
}

export default function SearchBar({ placeholder = 'Search courses, faculty, topics...', onSearch, debounceMs = 300 }: SearchBarProps) {
  const [term, setTerm] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(term)
    }, debounceMs)
    return () => clearTimeout(handler)
  }, [term, debounceMs, onSearch])

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
      />
      {term && (
        <button onClick={() => setTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
