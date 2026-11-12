import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold',
              trend === 'up' && 'text-emerald-600',
              trend === 'down' && 'text-red-500',
              trend === 'neutral' && 'text-gray-400'
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  )
}
