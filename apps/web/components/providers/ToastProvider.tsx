'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '6px',
          fontSize: '13px',
          border: '1px solid #1E293B',
        },
        success: {
          iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
        },
      }}
    />
  )
}
