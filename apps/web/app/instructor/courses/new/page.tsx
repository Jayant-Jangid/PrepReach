'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api, { coursesAPI } from '@/lib/api'
import { ExamCategory, LectureType } from '@/types'
import { EXAM_CATEGORY_LABELS, formatPrice } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Video,
  FileText,
  Radio,
  Eye,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TempLecture {
  title: string
  type: LectureType
  duration: number
  isPreview: boolean
}

interface TempModule {
  title: string
  lectures: TempLecture[]
}

export default function NewCourseWizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Basic Info
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [examCategory, setExamCategory] = useState<ExamCategory>('civil_service')
  const [price, setPrice] = useState('1999')
  const [language, setLanguage] = useState('English')

  // Step 2: Modules & Lectures
  const [modules, setModules] = useState<TempModule[]>([
    {
      title: 'Module 1: Introduction & Exam Overview',
      lectures: [
        { title: 'Syllabus Breakdown & Strategy', type: 'video', duration: 15, isPreview: true },
        { title: 'Essential Reference Material & Roadmap', type: 'video', duration: 25, isPreview: false },
      ],
    },
  ])

  // Step 3: Options
  const [publishImmediately, setPublishImmediately] = useState(true)

  // Module management helpers
  const addModule = () => {
    setModules([
      ...modules,
      {
        title: `Module ${modules.length + 1}: Core Concepts`,
        lectures: [{ title: 'Overview Lesson', type: 'video', duration: 20, isPreview: false }],
      },
    ])
  }

  const removeModule = (mIdx: number) => {
    if (modules.length === 1) {
      toast.error('A course must have at least one module')
      return
    }
    setModules(modules.filter((_, i) => i !== mIdx))
  }

  const updateModuleTitle = (mIdx: number, val: string) => {
    const copy = [...modules]
    copy[mIdx].title = val
    setModules(copy)
  }

  const addLectureToModule = (mIdx: number) => {
    const copy = [...modules]
    copy[mIdx].lectures.push({
      title: `Lesson ${copy[mIdx].lectures.length + 1}`,
      type: 'video',
      duration: 30,
      isPreview: false,
    })
    setModules(copy)
  }

  const removeLecture = (mIdx: number, lIdx: number) => {
    const copy = [...modules]
    copy[mIdx].lectures = copy[mIdx].lectures.filter((_, i) => i !== lIdx)
    setModules(copy)
  }

  const updateLectureField = <K extends keyof TempLecture>(
    mIdx: number,
    lIdx: number,
    field: K,
    val: TempLecture[K]
  ) => {
    const copy = [...modules]
    copy[mIdx].lectures[lIdx][field] = val
    setModules(copy)
  }

  // Final Submit
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description')
      return
    }

    try {
      setIsSubmitting(true)

      // 1. Create Course
      const coursePayload = {
        title: title.trim(),
        description: description.trim(),
        examCategory,
        price: parseFloat(price) || 0,
        language,
      }
      const courseRes = await coursesAPI.create(coursePayload)
      const createdCourse = courseRes.data.data.course || courseRes.data.data
      const courseId = createdCourse._id

      // 2. Create Modules & Lectures sequentially
      for (let m = 0; m < modules.length; m++) {
        const mod = modules[m]
        const modRes = await api.post(`/courses/${courseId}/modules`, {
          title: mod.title,
          order: m + 1,
        })
        const createdMod = modRes.data.data.module || modRes.data.data

        for (let l = 0; l < mod.lectures.length; l++) {
          const lec = mod.lectures[l]
          await api.post(`/courses/${courseId}/modules/${createdMod._id}/lectures`, {
            title: lec.title,
            type: lec.type,
            duration: Number(lec.duration) || 0,
            isPreview: lec.isPreview,
            order: l + 1,
          })
        }
      }

      // 3. Publish if requested
      if (publishImmediately) {
        await coursesAPI.publish(courseId)
      }

      toast.success('Course created successfully!')
      router.push('/instructor/dashboard')
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to create course. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
        <Link
          href="/instructor/dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground">Course Creation Wizard</h1>
          <p className="text-xs text-gray-500">
            Step {currentStep} of 3: {currentStep === 1 ? 'Basic Info' : currentStep === 2 ? 'Curriculum' : 'Review & Publish'}
          </p>
        </div>
      </div>

      {/* Wizard Progress Indicator */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        {[
          { step: 1, label: '1. Basic Details' },
          { step: 2, label: '2. Modules & Lectures' },
          { step: 3, label: '3. Review & Submit' },
        ].map((item) => (
          <div
            key={item.step}
            className={`flex items-center gap-2 text-sm font-bold ${
              currentStep === item.step
                ? 'text-primary-600'
                : currentStep > item.step
                ? 'text-emerald-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                currentStep === item.step
                  ? 'bg-primary-500 text-white shadow-md'
                  : currentStep > item.step
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {currentStep > item.step ? '✓' : item.step}
            </div>
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── STEP 1: Basic Information ─────────────────────────────── */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-foreground">Step 1: Basic Course Information</h3>

          <div className="space-y-4">
            <Input
              label="Course Title"
              placeholder="e.g. UPSC Prelims General Studies Comprehensive 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="label">Course Description & Overview</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="Describe what aspirants will learn, key focus areas, and exam orientation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Exam Category</label>
                <select
                  value={examCategory}
                  onChange={(e) => setExamCategory(e.target.value as ExamCategory)}
                  className="input cursor-pointer"
                >
                  <option value="civil_service">Civil Service (UPSC / State PSC)</option>
                  <option value="public_banking">Public Banking (IBPS / SBI PO)</option>
                  <option value="railway">Railway (RRB NTPC, Group D)</option>
                  <option value="municipal">Municipal & State Bodies</option>
                </select>
              </div>

              <Input
                label="Course Price (₹ INR)"
                type="number"
                min="0"
                step="100"
                placeholder="1999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                hint="Pay-per-course one-time pricing for students"
                required
              />
            </div>

            <div>
              <label className="label">Medium of Instruction</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual (Hinglish)">Bilingual (Hinglish)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              variant="primary"
              onClick={() => {
                if (!title.trim() || !description.trim()) {
                  toast.error('Please enter course title and description')
                  return
                }
                setCurrentStep(2)
              }}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue to Curriculum
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Modules & Lectures ────────────────────────────── */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Step 2: Build Curriculum</h3>
              <p className="text-xs text-gray-500">
                Organize your course into modules. Mark 1–2 lectures as Free Preview for aspirants.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addModule}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Module
            </Button>
          </div>

          <div className="space-y-6">
            {modules.map((mod, mIdx) => (
              <div
                key={mIdx}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Input
                      label={`Module ${mIdx + 1} Title`}
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => removeModule(mIdx)}
                    className="p-2 text-gray-400 hover:text-red-500 mt-6"
                    title="Delete Module"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Lectures inside Module */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                    Lectures in this Module
                  </label>

                  {mod.lectures.map((lec, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={lec.title}
                          onChange={(e) =>
                            updateLectureField(mIdx, lIdx, 'title', e.target.value)
                          }
                          placeholder="Lecture title"
                          className="input py-1.5 text-xs"
                        />
                      </div>

                      <div className="w-32">
                        <select
                          value={lec.type}
                          onChange={(e) =>
                            updateLectureField(
                              mIdx,
                              lIdx,
                              'type',
                              e.target.value as LectureType
                            )
                          }
                          className="input py-1.5 text-xs cursor-pointer"
                        >
                          <option value="video">Video</option>
                          <option value="live">Live Class</option>
                          <option value="material">PDF Notes</option>
                        </select>
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Mins"
                          value={lec.duration || ''}
                          onChange={(e) =>
                            updateLectureField(
                              mIdx,
                              lIdx,
                              'duration',
                              Number(e.target.value)
                            )
                          }
                          className="input py-1.5 text-xs"
                        />
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={lec.isPreview}
                          onChange={(e) =>
                            updateLectureField(mIdx, lIdx, 'isPreview', e.target.checked)
                          }
                          className="rounded text-accent-600 focus:ring-accent-500 h-4 w-4"
                        />
                        <span className="font-semibold text-accent-700 flex items-center gap-1">
                          <Eye className="h-3 w-3" /> Preview
                        </span>
                      </label>

                      <button
                        onClick={() => removeLecture(mIdx, lIdx)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addLectureToModule(mIdx)}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    className="text-primary-600"
                  >
                    Add Lecture
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(3)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Review & Submit
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Publish ──────────────────────────────── */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-foreground">Step 3: Review Course Details</h3>

          <div className="rounded-xl bg-gray-50 p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                  {EXAM_CATEGORY_LABELS[examCategory]}
                </span>
                <h4 className="text-lg font-bold text-foreground mt-0.5">{title}</h4>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              </div>
              <span className="text-xl font-black text-foreground">
                {formatPrice(parseFloat(price) || 0)}
              </span>
            </div>

            <div className="flex gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
              <span>Medium: {language}</span>
              <span>•</span>
              <span>{modules.length} Modules</span>
              <span>•</span>
              <span>
                {modules.reduce((a, m) => a + m.lectures.length, 0)} Total Lessons
              </span>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-primary-100 bg-primary-50/50 p-4">
            <div>
              <h5 className="text-sm font-bold text-foreground">Publish to Catalog Immediately</h5>
              <p className="text-xs text-gray-500">
                If enabled, students can see and enroll in this course as soon as you submit.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Curriculum
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              rightIcon={<CheckCircle2 className="h-5 w-5" />}
            >
              Create Bootcamp
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
