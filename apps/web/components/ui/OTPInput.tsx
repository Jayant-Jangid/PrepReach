'use client'

import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value?: string
  onChange: (otp: string) => void
  disabled?: boolean
  className?: string
}

export default function OTPInput({
  length = 6,
  value = '',
  onChange,
  disabled = false,
  className,
}: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array(length).fill('')
    if (value) {
      for (let i = 0; i < Math.min(value.length, length); i++) {
        arr[i] = value[i]
      }
    }
    return arr
  })

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value) {
      const arr = Array(length).fill('')
      for (let i = 0; i < Math.min(value.length, length); i++) {
        arr[i] = value[i]
      }
      setDigits(arr)
    }
  }, [value, length])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Take only the last character entered
    const char = val.slice(-1)

    if (char && !/^\d+$/.test(char)) return

    const newDigits = [...digits]
    newDigits[index] = char
    setDigits(newDigits)

    const fullOtp = newDigits.join('')
    onChange(fullOtp)

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus()
      } else {
        const newDigits = [...digits]
        newDigits[index] = ''
        setDigits(newDigits)
        onChange(newDigits.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    const cleanNumbers = pastedData.replace(/\D/g, '').slice(0, length)

    if (!cleanNumbers) return

    const newDigits = [...digits]
    for (let i = 0; i < length; i++) {
      newDigits[i] = cleanNumbers[i] || ''
    }
    setDigits(newDigits)
    onChange(newDigits.join(''))

    // Focus the box following the last pasted char or last box
    const focusIndex = Math.min(cleanNumbers.length, length - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-3', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digits[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'h-12 w-12 sm:h-14 sm:w-14 text-center text-xl sm:text-2xl font-bold rounded-xl border border-gray-300 bg-white text-foreground shadow-sm transition-all duration-200',
            'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100',
            'disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
            digits[index] ? 'border-primary-500 bg-primary-50/20' : ''
          )}
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}
