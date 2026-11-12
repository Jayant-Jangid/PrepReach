import React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base font-semibold',
  xl: 'h-20 w-20 text-xl font-bold',
}

export default function Avatar({ name = 'User', src, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium select-none shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
