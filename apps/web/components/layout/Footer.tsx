'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, CheckCircle2, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Footer() {
  const { user, isAuthenticated } = useAuthStore()

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'instructor') return '/instructor/dashboard'
    return '/student/dashboard'
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-500 text-white font-bold text-sm">
                P
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Prep<span className="text-accent-500">Reach</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regional government examination bootcamps and mock test series tailored for aspirants across Tier 2 and Tier 3 cities.
            </p>
          </div>

          {/* Exam Tracks */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Examination Tracks
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/courses?category=civil_service" className="hover:text-primary-600">
                  Civil Services (UPSC & State PSC)
                </Link>
              </li>
              <li>
                <Link href="/courses?category=public_banking" className="hover:text-primary-600">
                  Public Banking (IBPS & SBI PO)
                </Link>
              </li>
              <li>
                <Link href="/courses?category=railway" className="hover:text-primary-600">
                  Railway Recruitment (RRB NTPC & ALP)
                </Link>
              </li>
              <li>
                <Link href="/courses?category=municipal" className="hover:text-primary-600">
                  Municipal & State Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/courses" className="hover:text-primary-600">
                  Course Catalog
                </Link>
              </li>
              {isAuthenticated && user ? (
                <li>
                  <Link href={getDashboardPath()} className="hover:text-primary-600 font-medium text-slate-800">
                    My Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="hover:text-primary-600">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-primary-600">
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Quality & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary-600 shrink-0" />
                <span>Verified subject matter specialists</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600 shrink-0" />
                <span>Modular pay-per-course structure</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-700 shrink-0" />
                <span>Free sample lectures on all courses</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PrepReach Education. All rights reserved.</p>
          <div className="flex gap-5 text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-800 cursor-pointer">Grievance Redressal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
