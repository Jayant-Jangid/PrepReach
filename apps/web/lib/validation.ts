/**
 * Client-side Zod-compatible validation schemas and helpers for registration and login
 */

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return 'Email address is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address'
  return null
}

export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) return 'Phone number is required'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 10) return 'Phone number must be exactly 10 digits'
  return null
}

export function validateOtp(otp: string): string | null {
  if (!otp || !otp.trim()) return 'Verification code is required'
  if (!/^\d{6}$/.test(otp.trim())) return 'Verification code must be exactly 6 digits'
  return null
}

export function validateLoginForm(data: { email: string }): ValidationResult {
  const errors: Record<string, string> = {}
  const emailErr = validateEmail(data.email)
  if (emailErr) errors.email = emailErr
  return { isValid: Object.keys(errors).length === 0, errors }
}

export function validateRegisterForm(data: {
  fullName: string
  email: string
  phone: string
  targetExam?: string
}): ValidationResult {
  const errors: Record<string, string> = {}
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters'
  }
  const emailErr = validateEmail(data.email)
  if (emailErr) errors.email = emailErr
  const phoneErr = validatePhone(data.phone)
  if (phoneErr) errors.phone = phoneErr
  return { isValid: Object.keys(errors).length === 0, errors }
}
