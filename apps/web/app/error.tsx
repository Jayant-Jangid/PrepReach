'use client'

import React, { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-6 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        An unexpected error occurred while rendering this view. Our engineering team has been notified.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} variant="primary" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
        <Button onClick={() => (window.location.href = '/')} variant="outline">
          Return to Safety
        </Button>
      </div>
    </div>
  )
}
