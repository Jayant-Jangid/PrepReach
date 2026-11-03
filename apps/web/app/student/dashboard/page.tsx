'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { enrollmentsAPI, coursesAPI } from '@/lib/api'
import { Course, Enrollment } from '@/types'
import StatsCard from '@/components/dashboard/StatsCard'
import ProgressCard from '@/components/dashboard/ProgressCard'
import LiveClassBanner from '@/components/course/LiveClassBanner'
import CourseCard from '@/components/course/CourseCard'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { BookOpen, CheckCircle, Flame, ArrowRight } from 'lucide-react'

export default function StudentDashboardPage() {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        // 1. Fetch user's enrollments safely
        try {
          const enrollRes = await enrollmentsAPI.my()
          const payload = enrollRes.data?.data
          const list = Array.isArray(payload?.enrollments)
            ? payload.enrollments
            : Array.isArray(payload)
            ? payload
            : []
          setEnrollments(list)
        } catch (e) {
          console.warn('Could not load enrollments:', e)
          setEnrollments([])
        }

        // 2. Fetch recommended courses safely
        try {
          const coursesRes = await coursesAPI.list({ limit: 3 })
          const payload = coursesRes.data?.data
          const list = Array.isArray(payload?.courses)
            ? payload.courses
            : Array.isArray(payload)
            ? payload
            : []
          setRecommendedCourses(list)
        } catch (e) {
          console.warn('Could not load courses:', e)
          setRecommendedCourses([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Derived stats with strict array guards
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : []
  const enrolledCount = safeEnrollments.length

  const completedLecturesCount = safeEnrollments.reduce((acc, curr) => {
    const completed = Array.isArray(curr.progress)
      ? curr.progress.filter((p) => (p.watchedPercent || 0) >= 90).length
      : 0
    return acc + completed
  }, 0)

  const avgProgress = enrolledCount > 0
    ? Math.round(
        safeEnrollments.reduce((sum, e) => sum + (e.overallProgress || 0), 0) / enrolledCount
      )
    : 0

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Welcome Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || 'Aspirant'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track your coursework progress, upcoming masterclasses, and exam milestones.
          </p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Browse All Courses
          </Button>
        </Link>
      </div>

      {/* ── Live Class Banner (Upcoming) ─────────────────────────── */}
      <LiveClassBanner
        title="GS Paper 2: Constitutional Amendments & Landmark Judgments"
        courseTitle="Civil Services Masterclass"
        instructorName="Dr. R. Ramanathan, Ex-IRS"
        scheduledAt={new Date(Date.now() + 3600000 * 2).toISOString()}
      />

      {/* ── Stats Strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Enrolled Courses"
          value={enrolledCount}
          icon={BookOpen}
        />
        <StatsCard
          label="Lectures Completed"
          value={completedLecturesCount}
          icon={CheckCircle}
        />
        <StatsCard
          label="Overall Progress"
          value={`${avgProgress}%`}
          icon={Flame}
        />
      </div>

      {/* ── My Courses Section ───────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Enrolled Courses</h2>
          <span className="text-xs font-semibold text-slate-500">
            {enrolledCount} {enrolledCount === 1 ? 'course' : 'courses'}
          </span>
        </div>

        {safeEnrollments.length > 0 ? (
          <div className="space-y-3">
            {safeEnrollments.map((enrollment) => {
              const course = typeof enrollment.course === 'object' ? (enrollment.course as Course) : null
              if (!course) return null

              return (
                <ProgressCard
                  key={enrollment._id}
                  course={course}
                  overallProgress={enrollment.overallProgress || 0}
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No active enrollments yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t enrolled in any courses yet. Choose your examination track and start learning with free sample lectures.
            </p>
            <Link href="/courses" className="inline-block pt-1">
              <Button variant="accent" size="sm">
                Explore Course Catalog
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* ── Recommended Courses ──────────────────────────────────── */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Curated For You</h2>
              <p className="text-xs text-slate-500">High-yield courses aligned with regional exam patterns</p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              See all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
