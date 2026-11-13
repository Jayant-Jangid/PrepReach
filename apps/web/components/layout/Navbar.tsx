'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { LogOut, LayoutDashboard, Menu, X, PlusCircle } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'instructor') return '/instructor/dashboard'
    return '/student/dashboard'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/assets/prepreach_icon.png"
            alt="PrepReach Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Prep<span className="text-accent-500">Reach</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/courses"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            All Courses
          </Link>

          {isAuthenticated && user?.role === 'student' && (
            <Link
              href="/student/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              My Learning
            </Link>
          )}

          {isAuthenticated && user?.role === 'instructor' && (
            <>
              <Link
                href="/instructor/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Faculty Dashboard
              </Link>
              <Link
                href="/instructor/courses/new"
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Create Course
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Right CTA / User dropdown */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-md p-1 hover:bg-slate-100 transition-colors"
              >
                <Avatar name={user.name} size="sm" />
                <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-slate-200 bg-white py-1 shadow-card">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href={getDashboardPath()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="accent" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            All Courses
          </Link>
          {isAuthenticated && user ? (
            <>
              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="block w-full text-left py-2 text-sm font-medium text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
