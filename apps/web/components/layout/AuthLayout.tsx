import React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand logo at top */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-500 text-white font-bold text-sm">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Prep<span className="text-accent-500">Reach</span>
          </span>
        </Link>
        <p className="mt-1 text-xs text-slate-500">
          Regional Government Examination Bootcamps
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
          {children}
        </div>
      </div>
    </div>
  )
}
