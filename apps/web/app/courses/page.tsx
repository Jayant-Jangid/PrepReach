'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { coursesAPI } from '@/lib/api'
import { Course, ExamCategory } from '@/types'
import CourseFilters from '@/components/course/CourseFilters'
import CourseGrid from '@/components/course/CourseGrid'
import Button from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'

function CourseCatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get('category') as ExamCategory) || ''

  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | ''>(initialCategory)
  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const params: Record<string, unknown> = {
        page,
        limit: 9,
      }
      if (selectedCategory) params.examCategory = selectedCategory
      if (search) params.search = search
      if (maxPrice < 10000) params.maxPrice = maxPrice

      const res = await coursesAPI.list(params)
      const payload = res.data?.data

      // Unpack array whether it's wrapped in { courses: [...] } or direct array
      const courseList: Course[] = Array.isArray(payload?.courses)
        ? payload.courses
        : Array.isArray(payload)
        ? payload
        : []

      setCourses(courseList)

      const pagination = payload?.pagination || res.data?.pagination
      if (pagination) {
        setTotalPages(pagination.totalPages || 1)
        setTotalCount(pagination.total || courseList.length)
      } else {
        setTotalCount(courseList.length)
        setTotalPages(1)
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [selectedCategory, search, maxPrice, page])

  const handleReset = () => {
    setSelectedCategory('')
    setSearch('')
    setMaxPrice(10000)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Government Examination Bootcamps
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {totalCount > 0 ? `Showing ${totalCount} courses` : 'Browse curated courses by veteran faculty'}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="block lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Main Grid + Filter Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <CourseFilters
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat)
              setPage(1)
            }}
            search={search}
            onSearchChange={(s) => {
              setSearch(s)
              setPage(1)
            }}
            minPrice={0}
            maxPrice={maxPrice}
            onPriceChange={(_, max) => {
              setMaxPrice(max)
              setPage(1)
            }}
            onReset={handleReset}
          />
        </div>

        {/* Courses Grid */}
        <div className="lg:col-span-3 space-y-6">
          <CourseGrid courses={courses} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              <span className="text-xs font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 lg:hidden">
          <div className="ml-auto w-full max-w-xs bg-white p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">Filter Courses</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <CourseFilters
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat)
                  setPage(1)
                }}
                search={search}
                onSearchChange={(s) => {
                  setSearch(s)
                  setPage(1)
                }}
                minPrice={0}
                maxPrice={maxPrice}
                onPriceChange={(_, max) => {
                  setMaxPrice(max)
                  setPage(1)
                }}
                onReset={handleReset}
              />
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CourseCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading course catalog...</div>}>
      <CourseCatalogContent />
    </Suspense>
  )
}
