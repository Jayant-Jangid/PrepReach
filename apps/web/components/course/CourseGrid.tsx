import React from 'react'
import CourseCard from './CourseCard'
import { Course } from '@/types'
import { BookOpen } from 'lucide-react'

interface CourseGridProps {
  courses?: Course[]
  isLoading?: boolean
}

export default function CourseGrid({ courses = [], isLoading = false }: CourseGridProps) {
  const safeCourses = Array.isArray(courses) ? courses : []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-white p-4">
            <div className="aspect-video w-full rounded bg-slate-200 mb-4" />
            <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
            <div className="h-3 w-1/2 rounded bg-slate-200 mb-4" />
            <div className="h-4 w-1/3 rounded bg-slate-200 mt-auto" />
          </div>
        ))}
      </div>
    )
  }

  if (safeCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-100 text-slate-500 mb-3">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No courses found</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          We couldn&apos;t find any courses matching your filter criteria. Try adjusting the category or search keyword.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {safeCourses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  )
}
