import React from 'react'
import Link from 'next/link'
import { Course } from '@/types'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import { PlayCircle, BookOpen } from 'lucide-react'
import { EXAM_CATEGORY_LABELS } from '@/lib/utils'

interface ProgressCardProps {
  course: Course
  overallProgress: number // 0 to 100
  lastWatchedLectureId?: string
}

export default function ProgressCard({
  course,
  overallProgress,
  lastWatchedLectureId,
}: ProgressCardProps) {
  const categoryLabel = EXAM_CATEGORY_LABELS[course.examCategory] || course.examCategory

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      {/* Course Info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-primary-100">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-500">
              <BookOpen className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">
            {categoryLabel}
          </span>
          <h4 className="text-base font-bold text-foreground line-clamp-1">
            {course.title}
          </h4>
          <p className="text-xs text-gray-400">
            {course.totalLectures} lectures • Lifetime Access
          </p>
        </div>
      </div>

      {/* Progress & Action */}
      <div className="w-full md:w-64 space-y-3 shrink-0">
        <ProgressBar
          value={overallProgress}
          showLabel
          variant={overallProgress >= 100 ? 'success' : 'primary'}
        />

        <Link
          href={`/courses/${course._id}/learn${
            lastWatchedLectureId ? `?lectureId=${lastWatchedLectureId}` : ''
          }`}
          className="block"
        >
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            leftIcon={<PlayCircle className="h-4 w-4" />}
          >
            {overallProgress > 0 ? 'Continue Learning' : 'Start Course'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
