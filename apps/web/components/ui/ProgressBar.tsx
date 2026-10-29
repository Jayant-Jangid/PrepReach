import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0 to 100
  max?: number
  variant?: 'primary' | 'accent' | 'success'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100)

  const variantColors = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    success: 'bg-emerald-500',
  }

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-gray-600">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-gray-100 overflow-hidden', sizeHeights[size])}>
        <div
          className={cn('rounded-full transition-all duration-300', variantColors[variant], sizeHeights[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
