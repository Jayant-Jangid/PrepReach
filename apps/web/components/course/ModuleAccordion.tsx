'use client'

import React, { useState } from 'react'
import { Module, Lecture } from '@/types'
import { formatDuration } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Lock,
  CheckCircle2,
  FileText,
  Radio,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModuleAccordionProps {
  modules: Module[]
  activeLectureId?: string
  completedLectureIds?: string[]
  isEnrolled?: boolean
  onSelectLecture?: (lecture: Lecture, module: Module) => void
}

export default function ModuleAccordion({
  modules,
  activeLectureId,
  completedLectureIds = [],
  isEnrolled = false,
  onSelectLecture,
}: ModuleAccordionProps) {
  // Open the first module by default
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    if (modules && modules.length > 0) {
      initial[modules[0]._id] = true
    }
    return initial
  })

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const getLectureIcon = (lecture: Lecture, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
    }
    if (lecture.type === 'live') {
      return <Radio className="h-4 w-4 text-accent-500 shrink-0 animate-pulse" />
    }
    if (lecture.type === 'material') {
      return <FileText className="h-4 w-4 text-primary-500 shrink-0" />
    }
    return <PlayCircle className="h-4 w-4 text-primary-500 shrink-0" />
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
        No modules have been uploaded for this course yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {modules.map((mod, index) => {
        const isOpen = !!openModules[mod._id]
        const lectureCount = mod.lectures ? mod.lectures.length : 0

        return (
          <div
            key={mod._id || index}
            className="rounded-xl border border-gray-100 bg-white overflow-hidden transition-all shadow-sm"
          >
            {/* Header */}
            <button
              onClick={() => toggleModule(mod._id)}
              className="flex w-full items-center justify-between p-4 text-left font-semibold text-foreground hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-50 text-xs font-bold text-primary-600">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{mod.title}</h4>
                  <p className="text-xs text-gray-400 font-normal">
                    {lectureCount} {lectureCount === 1 ? 'lesson' : 'lessons'}
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </button>

            {/* Lecture list */}
            {isOpen && mod.lectures && (
              <div className="border-t border-gray-50 bg-gray-50/50 p-2 space-y-1">
                {mod.lectures.map((lecture) => {
                  const isActive = activeLectureId === lecture._id
                  const isCompleted = completedLectureIds.includes(lecture._id)
                  const canAccess = isEnrolled || lecture.isPreview

                  return (
                    <div
                      key={lecture._id}
                      onClick={() => {
                        if (canAccess && onSelectLecture) {
                          onSelectLecture(lecture, mod)
                        }
                      }}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors',
                        canAccess ? 'cursor-pointer hover:bg-white shadow-none' : 'opacity-60 cursor-not-allowed',
                        isActive ? 'bg-primary-50 border border-primary-200 font-semibold text-primary-700' : 'text-gray-700'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {getLectureIcon(lecture, isCompleted)}
                        <span className="truncate">{lecture.title}</span>
                        {lecture.isPreview && !isEnrolled && (
                          <span className="inline-flex items-center gap-1 rounded bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold text-accent-600 uppercase">
                            <Eye className="h-2.5 w-2.5" /> Preview
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-gray-400">
                        {lecture.duration > 0 && <span>{formatDuration(lecture.duration)}</span>}
                        {!canAccess && <Lock className="h-3.5 w-3.5 text-gray-400" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
