'use client'

import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-6 shadow-sm">
        <Compass className="h-10 w-10 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-slate-700">Page Not Found</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        The study module, course route, or page you were looking for does not exist or has been relocated.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link href="/courses">
          <Button variant="primary">Explore Course Catalog</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
