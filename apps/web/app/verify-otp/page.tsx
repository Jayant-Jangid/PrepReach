'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import OTPInput from '@/components/ui/OTPInput'
import Button from '@/components/ui/Button'
import { CheckCircle2, RotateCcw, ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''
  const purpose = searchParams.get('purpose') || 'registration'
  const codeParam = searchParams.get('code') || ''

  const { login } = useAuthStore()

  const [otp, setOtp] = useState(codeParam)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [isResending, setIsResending] = useState(false)

  // 30s countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Auto-verify if code was passed from registration/login
  useEffect(() => {
    if (codeParam && codeParam.length === 6) {
      handleVerify(codeParam)
    }
  }, [codeParam])

  const handleVerify = async (codeToVerify?: string) => {
    const finalOtp = codeToVerify || otp
    if (finalOtp.length !== 6) {
      setError('Please enter all 6 digits.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const res = await authAPI.verifyOTP(email, finalOtp, purpose)
      const data = res.data.data

      toast.success('Verification successful! Welcome to PrepReach.')
      login(data.user, data.accessToken, data.refreshToken || '')

      // Redirect according to user role
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (data.user.role === 'instructor') {
        router.push('/instructor/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return

    try {
      setIsResending(true)
      await authAPI.resendOTP(email, purpose)
      toast.success('A fresh 6-digit OTP has been sent!')
      setCountdown(30)
      setOtp('')
      setError('')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Could not resend OTP. Please try again in a moment.'
      toast.error(msg)
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-4">No email address provided for verification.</p>
        <Link href="/login">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 mb-3">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Verify Your Email</h2>
        <p className="mt-1 text-sm text-gray-500">
          We sent a 6-digit verification code to
        </p>
        <p className="mt-0.5 text-sm font-bold text-foreground bg-primary-50 inline-block px-3 py-1 rounded-full border border-primary-100">
          {email}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <OTPInput
            length={6}
            value={otp}
            onChange={(val) => {
              setOtp(val)
              if (error) setError('')
              if (val.length === 6) {
                handleVerify(val)
              }
            }}
            disabled={isSubmitting}
          />
          {error && <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p>}
        </div>

        <Button
          onClick={() => handleVerify()}
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
          disabled={otp.length !== 6 || isSubmitting}
        >
          Verify & Continue
        </Button>

        {/* Resend OTP */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
          <span>Didn&apos;t receive the email?</span>
          {countdown > 0 ? (
            <span className="font-semibold text-gray-400">Resend code in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-1 font-bold text-primary-600 hover:text-primary-700 hover:underline disabled:opacity-50"
            >
              <RotateCcw className="h-3 w-3" />
              Resend OTP
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Use a different email address
        </Link>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-sm text-gray-400">Loading verification...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
