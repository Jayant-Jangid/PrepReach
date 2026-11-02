'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import {
  Landmark,
  Building2,
  Train,
  Building,
  Check,
  Play,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  BookOpen,
  HelpCircle,
  BarChart3,
} from 'lucide-react'

export default function LandingPage() {
  const { user, isAuthenticated } = useAuthStore()

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'instructor') return '/instructor/dashboard'
    return '/student/dashboard'
  }

  const examCategories = [
    {
      id: 'civil_service',
      title: 'Civil Services',
      subheading: 'UPSC CSE, State PSC Prelims & Mains',
      description:
        'General Studies Paper I–IV, CSAT analytical reasoning, and structured answer-writing workshops focused on state extensions.',
      exams: ['UPSC CSE', 'UPPSC', 'BPSC', 'MPPSC'],
      icon: Landmark,
    },
    {
      id: 'public_banking',
      title: 'Public Banking',
      subheading: 'SBI PO, IBPS PO & Clerk',
      description:
        'Quantitative aptitude shortcuts, high-order reasoning puzzles, financial awareness, and sectional speed drills.',
      exams: ['SBI PO', 'IBPS PO', 'IBPS Clerk', 'RRB Scale I'],
      icon: Building2,
    },
    {
      id: 'railway',
      title: 'Railway Recruitment',
      subheading: 'RRB NTPC, ALP & Group D',
      description:
        'General science, mathematics, current affairs dossiers, and computer-based test (CBT) simulations.',
      exams: ['RRB NTPC', 'ALP Technical', 'Group D', 'RRB JE'],
      icon: Train,
    },
    {
      id: 'municipal',
      title: 'Municipal & State Bodies',
      subheading: 'State Administrative & Urban Bodies',
      description:
        'Regional municipal administration acts, local revenue laws, state general awareness, and department examinations.',
      exams: ['Municipal Corp', 'Panchayat Officer', 'Revenue Inspector'],
      icon: Building,
    },
  ]

  const pillars = [
    {
      icon: Play,
      title: 'Pay Per Course Only',
      description:
        'Zero forced subscriptions or locked multi-year bundles. Pay only for the specific subject or exam paper you need.',
    },
    {
      icon: BookOpen,
      title: 'Full Unlocked Previews',
      description:
        'Every course includes 1–2 complete sample lectures. Assess teaching pedagogy, syllabus depth, and notes before paying.',
    },
    {
      icon: BarChart3,
      title: 'Regional Exam Pattern Focus',
      description:
        'Curriculum matched to latest negative marking schemes, regional language nuances, and state-specific syllabus additions.',
    },
    {
      icon: FileText,
      title: 'Study Dossiers & PYQs',
      description:
        'Downloadable PDF summaries, previous 10-year solved question papers, and weekly current affairs compilations.',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* ── 1. Hero Section ───────────────────────────────────────── */}
        <section className="border-b border-slate-200 bg-white pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  <span>Targeted Regional Exam Prep</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-accent-600 font-bold">Tier 2 & 3 Focused</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-slate-900 leading-[1.12]">
                  Crack Your Government Exam.{' '}
                  <span className="text-primary-600">From Anywhere.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Live bootcamps, structured lecture archives, and mock test drills led by experienced
                  faculty and former civil servants. Transparent, pay-per-course pricing with zero
                  forced subscriptions.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link href="/courses">
                    <Button
                      variant="accent"
                      size="lg"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      Explore Courses
                    </Button>
                  </Link>

                  {isAuthenticated && user ? (
                    <Link href={getDashboardLink()}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Go to My Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/courses">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        View Free Previews
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Grounded checklist */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Free sample lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Latest 2026 pattern</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Pay only per module</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Grounded Course Interface Mockup */}
              <div className="lg:col-span-5">
                <div className="rounded-lg border border-slate-300 bg-white shadow-card overflow-hidden">
                  {/* Window Chrome Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="ml-2 font-mono text-[11px] text-slate-500">prepreach.in/curriculum</span>
                    </div>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                      LIVE BATCH
                    </span>
                  </div>

                  {/* Course Card Preview */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-primary-700 uppercase tracking-wider text-[11px]">
                          Civil Services Track
                        </span>
                        <span>GS Paper II</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        Indian Polity & Constitution: Foundational to Advanced
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Mentor: Dr. R. K. Sharma (Retd. State Civil Service)
                      </p>
                    </div>

                    {/* Curriculum Syllabus Items */}
                    <div className="space-y-2 border-t border-b border-slate-100 py-3 text-xs">
                      <div className="flex items-center justify-between rounded bg-slate-50 px-3 py-2 border border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-slate-800">Historical Underpinnings & Preamble</span>
                        </div>
                        <span className="text-[11px] text-slate-500">45m</span>
                      </div>

                      <div className="flex items-center justify-between rounded bg-primary-50 px-3 py-2 border border-primary-200">
                        <div className="flex items-center gap-2.5">
                          <Play className="h-3.5 w-3.5 text-primary-700 fill-primary-700" />
                          <span className="font-semibold text-primary-900">Fundamental Rights (Art 14–24)</span>
                        </div>
                        <span className="rounded bg-accent-500 text-white px-1.5 py-0.5 text-[10px] font-bold">
                          FREE PREVIEW
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-3 py-2 text-slate-600">
                        <div className="flex items-center gap-2.5">
                          <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                            3
                          </div>
                          <span>Directive Principles & Fundamental Duties</span>
                        </div>
                        <span className="text-[11px] text-slate-400">1h 10m</span>
                      </div>
                    </div>

                    {/* Bottom Metadata & Enrollment Info */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-[11px] text-slate-500">One-time enrollment</div>
                        <div className="text-lg font-bold text-slate-900">₹1,499</div>
                      </div>
                      <Link href="/courses">
                        <Button variant="primary" size="sm">
                          Start Sample Lecture
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Clean Institutional Metrics Bar ───────────────────── */}
        <section className="border-b border-slate-200 bg-slate-50 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="border-r last:border-r-0 border-slate-200 pr-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">4 Tracks</p>
                <p className="text-xs text-slate-600 mt-0.5">Civil Service, Banking, Rail, Municipal</p>
              </div>
              <div className="border-r last:border-r-0 border-slate-200 pr-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">Pay-As-You-Go</p>
                <p className="text-xs text-slate-600 mt-0.5">Zero annual lock-in contracts</p>
              </div>
              <div className="border-r last:border-r-0 border-slate-200 pr-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-600 mt-0.5">Syllabus coverage guarantee</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">Tier 2 & 3</p>
                <p className="text-xs text-slate-600 mt-0.5">Accessible pricing for regional students</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Exam Categories Grid ───────────────────────────────── */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Specialized Examination Streams
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Structured according to individual exam body requirements, marking schemes, and syllabus depths.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {examCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.id}
                    href={`/courses?category=${cat.id}`}
                    className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 hover:border-primary-400 hover:shadow-card transition-all"
                  >
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-700 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors mb-4">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                        {cat.title}
                      </h3>

                      <p className="text-xs font-medium text-accent-700 mt-0.5">
                        {cat.subheading}
                      </p>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {cat.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {cat.exams.map((exam, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            {exam}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-700">
                      <span>View Courses</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 4. Key Value Pillars ──────────────────────────────────── */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Built Around Aspirant Realities
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Designed specifically to eliminate the high financial barrier and friction of government examination preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white text-primary-700 shadow-subtle">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Clean Institutional CTA Banner ─────────────────────── */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-slate-200 bg-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">
                  Start Learning Today With Free Sample Lectures
                </h3>
                <p className="text-slate-300 text-sm">
                  Browse the catalog, preview the teaching quality, and enroll only in the modules you need.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/courses">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto">
                    Browse All Courses
                  </Button>
                </Link>

                {/* Only show Create Free Account if NOT logged in */}
                {isAuthenticated && user ? (
                  <Link href={getDashboardLink()}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                      Go to My Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                      Create Free Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
