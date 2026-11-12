'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesAPI } from '@/lib/api'
import { Course } from '@/types'
import { formatPrice, EXAM_CATEGORY_LABELS } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft, Plus, Check, Eye, BookOpen, Clock, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ManageCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)

  const loadCourse = async () => {
    try {
      setIsLoading(true)
      const res = await coursesAPI.getById(courseId)
      setCourse(res.data.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load course details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) loadCourse()
  }, [courseId])

  const handleTogglePublish = async () => {
    if (!course) return
    try {
      setIsTogglingPublish(true)
      const res = await coursesAPI.publish(courseId)
      setCourse(res.data.data)
      toast.success(res.data.data.isPublished ? 'Course published!' : 'Course unpublished.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update publish state.')
    } finally {
      setIsTogglingPublish(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-500">Course not found.</p>
        <Link href="/instructor/dashboard" className="text-xs text-primary-600 hover:underline mt-2 inline-block">
          &larr; Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/instructor/dashboard" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-bold text-slate-900 truncate max-w-lg">
            Manage: {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={course.isPublished ? 'outline' : 'accent'}
            size="sm"
            onClick={handleTogglePublish}
            isLoading={isTogglingPublish}
          >
            {course.isPublished ? 'Unpublish Course' : 'Publish Course'}
          </Button>
          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
              Preview As Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 font-medium">Status</p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {course.isPublished ? 'Published & Active' : 'Draft / Unpublished'}
          </p>
        </div>
        <div className="rounded border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 font-medium">Enrolled Aspirants</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{course.enrolledCount ?? 0}</p>
        </div>
        <div className="rounded border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 font-medium">Price</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{formatPrice(course.price)}</p>
        </div>
      </div>

      {/* Modules List */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Modules & Lectures</h2>
            <p className="text-xs text-slate-500">Structured lessons in this curriculum</p>
          </div>
        </div>

        {course.modules && course.modules.length > 0 ? (
          <div className="space-y-3">
            {course.modules.map((m, idx) => (
              <div key={m._id || idx} className="rounded border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Module {idx + 1}: {m.title}
                  </h3>
                  <span className="text-xs text-slate-500">{m.lectures?.length || 0} lectures</span>
                </div>
                {m.lectures && m.lectures.length > 0 && (
                  <div className="pl-4 space-y-1.5 border-l-2 border-slate-100 text-xs text-slate-600">
                    {m.lectures.map((l, lIdx) => (
                      <div key={l._id || lIdx} className="flex items-center justify-between py-1">
                        <span>{l.title}</span>
                        <div className="flex items-center gap-2">
                          {l.isPreview && (
                            <span className="rounded bg-accent-50 text-accent-700 px-1.5 py-0.5 text-[10px] font-semibold border border-accent-200">
                              Free Preview
                            </span>
                          )}
                          <span className="text-slate-400">{l.duration || 0}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">No modules found.</p>
        )}
      </div>
    </div>
  )
}
