'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesAPI, enrollmentsAPI } from '@/lib/api'
import { Course, Lecture } from '@/types'
import { useAuthStore } from '@/store/authStore'
import VideoPlayer from '@/components/course/VideoPlayer'
import ModuleAccordion from '@/components/course/ModuleAccordion'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft, CheckCircle2, ChevronRight, BookOpen, Clock, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CourseLearningPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const { user, isAuthenticated } = useAuthStore()

  const [course, setCourse] = useState<Course | null>(null)
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null)
  const [currentModuleId, setCurrentModuleId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseId}/learn`)
      return
    }

    const loadData = async () => {
      try {
        setIsLoading(true)
        const res = await coursesAPI.getById(courseId)
        const c: Course = res.data.data
        setCourse(c)

        // Select first lecture by default
        if (c.modules && c.modules.length > 0) {
          const firstMod = c.modules[0]
          if (firstMod.lectures && firstMod.lectures.length > 0) {
            setCurrentLecture(firstMod.lectures[0])
            setCurrentModuleId(firstMod._id)
          }
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load course.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [courseId, isAuthenticated])

  const handleMarkComplete = async () => {
    if (!currentLecture) return
    try {
      setIsUpdatingProgress(true)
      await enrollmentsAPI.updateProgress(courseId, {
        moduleId: currentModuleId,
        lectureId: currentLecture._id,
        watchedPercent: 100,
      })
      toast.success('Lecture marked as completed!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update progress.')
    } finally {
      setIsUpdatingProgress(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Course not found</h2>
        <Link href="/courses" className="mt-4 inline-block text-sm text-primary-600 hover:underline">
          &larr; Return to Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Learning Navigation Bar */}
      <header className="border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Course Details</span>
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-sm font-bold text-slate-900 truncate max-w-md sm:max-w-xl">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkComplete}
            isLoading={isUpdatingProgress}
            leftIcon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          >
            Mark as Done
          </Button>
        </div>
      </header>

      {/* Main Learning Room Layout: 70% Player, 30% Curriculum */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left 70%: Lecture Player & Notes */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="rounded-lg overflow-hidden border border-slate-300 bg-black aspect-video max-w-4xl mx-auto shadow-md">
            <VideoPlayer
              title={currentLecture?.title || course.title}
              videoUrl={currentLecture?.videoUrl}
              isPreview={false}
            />
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                  Current Lesson
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentLecture?.title || 'Overview'}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  {currentLecture?.duration ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {currentLecture.duration} mins
                    </span>
                  ) : null}
                  <span className="capitalize">Type: {currentLecture?.type || 'video'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span>Lecture Notes & References</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refer to your companion study guide PDF for summary tables, article maps, and landmark judicial citations covered in this lecture.
              </p>
            </div>
          </div>
        </div>

        {/* Right 30%: Sticky Curriculum Sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-4 space-y-4 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Curriculum Syllabus</h3>
            <p className="text-xs text-slate-500">Select any lecture to play</p>
          </div>

          <ModuleAccordion
            modules={course.modules || []}
            isEnrolled={true}
            onSelectLecture={(lecture) => {
              setCurrentLecture(lecture)
            }}
          />
        </div>
      </div>
    </div>
  )
}
