'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  wrapperClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftElement, rightElement, wrapperClassName, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'input',
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
