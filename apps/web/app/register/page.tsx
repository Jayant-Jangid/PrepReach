'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) {
      setError('Please provide your full name.')
      return
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    try {
      setIsLoading(true)
      const res = await authAPI.register(cleanName, cleanEmail)
      const debugOtp = res.data?.data?.debugOtp
      toast.success('Verification code sent to your email.')
      router.push(
        `/verify-otp?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(
          cleanName
        )}&purpose=registration${debugOtp ? `&code=${debugOtp}` : ''}`
      )
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to start registration. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Create Aspirant Account</h2>
        <p className="mt-1 text-xs text-slate-600">
          Sign up to access sample lectures, mock tests, and course materials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Priya Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftElement={<User className="h-4 w-4" />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="aspirant@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftElement={<Mail className="h-4 w-4" />}
          error={error}
          required
        />

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>A 6-digit verification code will be sent to your email.</span>
        </div>

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
          Already registered?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary-600 hover:text-primary-700 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
