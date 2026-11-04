'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { X, BookOpen, Compass, Award, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export default function MobileDrawer({ isOpen, onClose, user }: MobileDrawerProps) {
  const pathname = usePathname()

  // Auto-close drawer on route navigation
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname])
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <span className="font-bold text-slate-800">Menu</span>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="mt-6 flex flex-col gap-4">
            <Link href="/courses" onClick={onClose} className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <BookOpen className="w-4 h-4 text-primary-500" /> Catalog
            </Link>
            <Link href="/courses?category=civil_service" onClick={onClose} className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <Compass className="w-4 h-4 text-accent-500" /> Civil Services
            </Link>
            <Link href="/courses?category=public_banking" onClick={onClose} className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <Award className="w-4 h-4 text-blue-500" /> Public Banking
            </Link>
            <Link href="/courses?category=railway" onClick={onClose} className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <Shield className="w-4 h-4 text-emerald-500" /> Railways
            </Link>
          </nav>
        </div>
        <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
          {!user && (
            <>
              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={onClose}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
