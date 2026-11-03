'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { coursesAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Course } from '@/types'
import StatsCard from '@/components/dashboard/StatsCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatPrice, EXAM_CATEGORY_LABELS } from '@/lib/utils'
import {
  BookOpen,
  Users,
  CheckCircle2,
  FileEdit,
  PlusCircle,
  Eye,
  Settings,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function InstructorDashboardPage() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const res = await coursesAPI.list()
      const payload = res.data?.data
      const allCourses: Course[] = Array.isArray(payload?.courses)
        ? payload.courses
        : Array.isArray(payload)
        ? payload
        : []
      // Filter for this instructor's courses if not admin
      const filtered =
        user?.role === 'admin'
          ? allCourses
          : allCourses.filter(
              (c) =>
                (typeof c.instructor === 'object' ? c.instructor._id : c.instructor) ===
                user?._id
            )
      setCourses(filtered)
    } catch (e) {
      console.error('Failed to load instructor courses:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [user])

  const handleTogglePublish = async (courseId: string) => {
    try {
      await coursesAPI.publish(courseId)
      toast.success('Course status updated!')
      loadCourses()
    } catch (err: any) {
      toast.error('Failed to update course status.')
    }
  }

  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.isPublished).length
  const draftCourses = totalCourses - publishedCourses
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)

  return (
    <div className="space-y-8">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Instructor Portal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create courses, upload modules & lectures, and track your students.
          </p>
        </div>

        <Link href="/instructor/courses/new">
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create New Course
          </Button>
        </Link>
      </div>

      {/* ── Stats Strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatsCard
          label="Total Courses"
          value={totalCourses}
          icon={BookOpen}
        />
        <StatsCard
          label="Total Students"
          value={totalStudents}
          icon={Users}
        />
        <StatsCard
          label="Published Courses"
          value={publishedCourses}
          icon={CheckCircle2}
        />
        <StatsCard
          label="Draft Courses"
          value={draftCourses}
          icon={FileEdit}
        />
      </div>

      {/* ── Courses Table ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">My Courses</h2>
            <p className="text-xs text-gray-500">Manage curriculum, pricing, and live sessions</p>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {totalCourses} {totalCourses === 1 ? 'course' : 'courses'}
          </span>
        </div>

        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/70 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Course Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Enrolled</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground max-w-xs truncate">
                        {c.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {c.totalLectures || 0} lectures
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                        {EXAM_CATEGORY_LABELS[c.examCategory] || c.examCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {formatPrice(c.price)}
                    </td>
                    <td className="px-6 py-4">
                      {c.enrolledCount || 0} students
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={c.isPublished ? 'success' : 'default'}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/courses/${c._id}`}>
                          <Button variant="ghost" size="sm" title="View Public Page">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/instructor/courses/${c._id}/manage`}>
                          <Button variant="outline" size="sm" leftIcon={<Settings className="h-3.5 w-3.5" />}>
                            Manage
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(c._id)}
                          title={c.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {c.isPublished ? (
                            <ToggleRight className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-foreground">No courses created yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Launch your first government exam preparation bootcamp and start educating aspirants today.
            </p>
            <Link href="/instructor/courses/new">
              <Button variant="primary" size="sm" className="mt-2">
                Create First Course
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
