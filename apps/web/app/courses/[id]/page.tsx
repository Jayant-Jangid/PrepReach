'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesAPI, enrollmentsAPI } from '@/lib/api'
import { Course } from '@/types'
import { formatPrice, formatDuration, EXAM_CATEGORY_LABELS, EXAM_CATEGORY_COLORS } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import ModuleAccordion from '@/components/course/ModuleAccordion'
import VideoPlayer from '@/components/course/VideoPlayer'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import {
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  Shield,
  ArrowRight,
  PlayCircle,
  HelpCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const { user, isAuthenticated } = useAuthStore()

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [activePreviewLecture, setActivePreviewLecture] = useState<{
    title: string
    videoUrl?: string
  } | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        const res = await coursesAPI.getById(courseId)
        const c: Course = res.data.data
        setCourse(c)

        // Set first preview lecture if available
        if (c.modules) {
          for (const m of c.modules) {
            const preview = m.lectures?.find((l) => l.isPreview)
            if (preview) {
              setActivePreviewLecture({ title: preview.title, videoUrl: preview.videoUrl })
              break
            }
          }
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load course details.')
      } finally {
        setIsLoading(false)
      }
    }

    const checkEnrollmentStatus = async () => {
      if (!isAuthenticated || user?.role !== 'student') return
      try {
        const res = await enrollmentsAPI.checkEnrollment(courseId)
        setIsEnrolled(res.data.isEnrolled)
      } catch (err) {
        // Not enrolled or guest
      }
    }

    if (courseId) {
      fetchCourse()
      checkEnrollmentStatus()
    }
  }, [courseId, isAuthenticated, user])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseId}`)
      return
    }

    if (user?.role !== 'student') {
      toast.error('Only student accounts can enroll in courses.')
      return
    }

    try {
      setIsEnrolling(true)
      await enrollmentsAPI.enroll(courseId)
      toast.success('Successfully enrolled! Welcome to the bootcamp.')
      setIsEnrolled(true)
      router.push(`/courses/${courseId}/learn`)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Enrollment failed. Please try again.'
      toast.error(msg)
    } finally {
      setIsEnrolling(false)
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
        <h2 className="text-xl font-bold text-slate-900">Course not found</h2>
        <p className="mt-2 text-sm text-slate-500">The requested course could not be located.</p>
      </div>
    )
  }

  const categoryLabel = EXAM_CATEGORY_LABELS[course.examCategory] || course.examCategory
  const categoryColor = EXAM_CATEGORY_COLORS[course.examCategory] || 'bg-slate-100 text-slate-800'
  const instructorName =
    typeof course.instructor === 'object' && course.instructor !== null
      ? course.instructor.name
      : 'PrepReach Faculty'

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${categoryColor}`}>
              {categoryLabel} Track
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-600">{course.language || 'English'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {course.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-600 border-t border-slate-200">
            <div>
              Faculty: <span className="font-semibold text-slate-900">{instructorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{course.enrolledCount ?? 0} Aspirants Enrolled</span>
            </div>
            {course.totalDuration > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{formatDuration(course.totalDuration)} of Instruction</span>
              </div>
            )}
            {course.totalLectures > 0 && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>{course.totalLectures} Lectures</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Curriculum & Preview) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sample Lecture Preview Player */}
          {activePreviewLecture && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-accent-600" />
                  <span>Sample Lecture Preview: {activePreviewLecture.title}</span>
                </h3>
                <span className="rounded bg-accent-50 text-accent-700 px-2 py-0.5 text-xs font-semibold border border-accent-200">
                  Unlocked
                </span>
              </div>
              <VideoPlayer
                title={activePreviewLecture.title}
                videoUrl={activePreviewLecture.videoUrl}
                isPreview={true}
              />
            </div>
          )}

          {/* Curriculum Accordion */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Bootcamp Curriculum & Lecture Breakdown
            </h2>

            {course.modules && course.modules.length > 0 ? (
              <ModuleAccordion
                modules={course.modules}
                isEnrolled={isEnrolled}
                onSelectLecture={(lecture) => {
                  if (lecture.isPreview || isEnrolled) {
                    setActivePreviewLecture({
                      title: lecture.title,
                      videoUrl: lecture.videoUrl,
                    })
                  } else {
                    toast.error('Enroll in this course to access this lecture.')
                  }
                }}
              />
            ) : (
              <div className="rounded border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                Curriculum modules will be uploaded by faculty shortly.
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Enrollment Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">One-Time Enrollment</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{formatPrice(course.price)}</span>
                <span className="text-xs text-slate-500">Lifetime access</span>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-b border-slate-100 py-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Full recorded lecture archive access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Live Q&A masterclasses with faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Downloadable PDF dossiers & notes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Sectional practice questions & answer keys</span>
              </div>
            </div>

            {isEnrolled ? (
              <Link href={`/courses/${courseId}/learn`} className="block">
                <Button variant="accent" size="lg" className="w-full">
                  Continue Learning &rarr;
                </Button>
              </Link>
            ) : (
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleEnroll}
                isLoading={isEnrolling}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Enroll Now • {formatPrice(course.price)}
              </Button>
            )}

            <p className="text-center text-[11px] text-slate-400">
              Pay-per-course guarantee • Zero recurring charges
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
