'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-slate-200 flex gap-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
              isActive
                ? 'border-primary-500 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
