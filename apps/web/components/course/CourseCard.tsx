import React from 'react'
import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, EXAM_CATEGORY_LABELS, EXAM_CATEGORY_COLORS } from '@/lib/utils'
import { Users, BookOpen, Clock } from 'lucide-react'

interface CourseCardProps {
  course: Course
  priority?: boolean
}

export default function CourseCard({ course }: CourseCardProps) {
  const instructorName =
    typeof course.instructor === 'object' && course.instructor !== null
      ? course.instructor.name
      : 'PrepReach Faculty'

  const categoryLabel = EXAM_CATEGORY_LABELS[course.examCategory] || course.examCategory
  const categoryColor = EXAM_CATEGORY_COLORS[course.examCategory] || 'bg-slate-100 text-slate-800 border border-slate-200'

  return (
    <Link
      href={`/courses/${course._id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-card transition-all"
    >
      {/* Thumbnail or placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-102"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-600 p-4 text-center border-b border-slate-200">
            <BookOpen className="h-7 w-7 mb-1.5 text-slate-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {categoryLabel} Track
            </span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${categoryColor}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-primary-700 transition-colors leading-snug">
          {course.title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Faculty: <span className="font-medium text-slate-700">{instructorName}</span>
        </p>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{course.enrolledCount ?? 0} students</span>
          </div>
          {course.totalLectures > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{course.totalLectures} lectures</span>
            </div>
          )}
        </div>

        {/* Price and Footer */}
        <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-slate-100">
          <div>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(course.price)}
            </span>
          </div>
          <span className="text-xs font-semibold text-accent-600 group-hover:text-accent-700 transition-colors">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
