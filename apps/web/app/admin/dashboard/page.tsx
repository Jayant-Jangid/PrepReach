'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { coursesAPI } from '@/lib/api'
import { Course } from '@/types'
import StatsCard from '@/components/dashboard/StatsCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatPrice, EXAM_CATEGORY_LABELS } from '@/lib/utils'
import {
  Users,
  BookOpen,
  DollarSign,
  ShieldAlert,
  Eye,
  Trash2,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const res = await coursesAPI.list()
      setCourses(res.data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.isPublished).length
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)
  const totalRevenue = courses.reduce((sum, c) => sum + (c.enrolledCount || 0) * (c.price || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          Platform Administration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Global analytics, content moderation, and platform activity monitoring.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatsCard
          label="Total Bootcamps"
          value={totalCourses}
          icon={BookOpen}
        />
        <StatsCard
          label="Total Enrollments"
          value={totalEnrollments}
          icon={Users}
        />
        <StatsCard
          label="Active Published"
          value={publishedCourses}
          icon={CheckCircle}
        />
        <StatsCard
          label="Estimated GMV"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
        />
      </div>

      {/* Course Moderation Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Global Course Registry</h2>
            <p className="text-xs text-gray-500">Inspect bootcamps across all exam categories</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Course</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Students</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground max-w-xs truncate">{c.title}</div>
                    <div className="text-xs text-gray-400">ID: {c._id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                      {EXAM_CATEGORY_LABELS[c.examCategory] || c.examCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {formatPrice(c.price)}
                  </td>
                  <td className="px-6 py-4">{c.enrolledCount || 0} enrolled</td>
                  <td className="px-6 py-4">
                    <Badge variant={c.isPublished ? 'success' : 'default'}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/courses/${c._id}`}>
                      <Button variant="ghost" size="sm" title="View Public Course">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
