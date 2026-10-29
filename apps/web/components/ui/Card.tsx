import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-100 shadow-sm',
    elevated: 'bg-white border border-gray-100 shadow-md',
    flat: 'bg-primary-50 border border-primary-100',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn('rounded-xl', variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex items-center', className)} {...props}>
      {children}
    </div>
  )
}
