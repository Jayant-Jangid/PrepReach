'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    try {
      setIsLoading(true)
      const res = await authAPI.login(cleanEmail)
      const debugOtp = res.data?.data?.debugOtp
      toast.success('Verification code sent to your email.')
      router.push(
        `/verify-otp?email=${encodeURIComponent(cleanEmail)}&purpose=login${debugOtp ? `&code=${debugOtp}` : ''}`
      )
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please check your email and try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Sign In to Your Account</h2>
        <p className="mt-1 text-xs text-slate-600">
          Enter your registered email address to receive a one-time passcode
        </p>
      </div>

      <div className="mb-5 rounded border border-slate-200 bg-slate-50 p-3 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Passwordless login: We send a 6-digit verification code directly to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="aspirant@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          leftElement={<Mail className="h-4 w-4" />}
          error={error}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Send Verification Code
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-600">
          New to PrepReach?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary-600 hover:text-primary-700 underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
