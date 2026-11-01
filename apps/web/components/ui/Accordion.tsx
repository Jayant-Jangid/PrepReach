'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  title: string
  content: string
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-800 hover:bg-slate-50 transition"
            >
              <span>{item.title}</span>
              <ChevronDown className={cn('w-4 h-4 text-slate-500 transition-transform', isOpen && 'rotate-180')} />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
