'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role?: 'student' | 'instructor' | 'admin'
}

export default function Sidebar({ role = 'student' }: SidebarProps) {
  const pathname = usePathname()

  const studentLinks = [
    { label: 'My Learning', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Course Catalog', href: '/courses', icon: BookOpen },
  ]

  const instructorLinks = [
    { label: 'Faculty Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'Create Course', href: '/instructor/courses/new', icon: PlusCircle },
    { label: 'Course Catalog', href: '/courses', icon: BookOpen },
  ]

  const adminLinks = [
    { label: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Course Catalog', href: '/courses', icon: BookOpen },
  ]

  const links =
    role === 'instructor'
      ? instructorLinks
      : role === 'admin'
      ? adminLinks
      : studentLinks

  return (
    <aside className="w-60 border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-3 space-y-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          {role} Menu
        </p>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  isActive ? 'text-primary-700' : 'text-slate-400'
                )}
              />
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto p-3 border-t border-slate-200">
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-900">Regional Exam Desk</p>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            Need guidance regarding syllabus changes or state notifications? Contact our desk.
          </p>
        </div>
      </div>
    </aside>
  )
}
