'use client'

import React, { useState } from 'react'
import { Play, Pause, Volume2, Maximize, RotateCcw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  videoUrl?: string
  title?: string
  isPreview?: boolean
  className?: string
  onComplete?: () => void
}

export default function VideoPlayer({
  videoUrl,
  title = 'Introduction to Exam Preparation',
  isPreview = false,
  className,
  onComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-slate-900 text-white aspect-video flex flex-col justify-between shadow-xl',
        className
      )}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
        <div className="flex items-center gap-2">
          {isPreview && (
            <span className="rounded bg-accent-500/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Free Preview
            </span>
          )}
          <h4 className="text-sm font-medium text-gray-200 line-clamp-1">{title}</h4>
        </div>
      </div>

      {/* Center play state / placeholder overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-500/90 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-primary-600 focus:outline-none ring-8 ring-primary-500/20"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 sm:h-10 sm:w-10" />
          ) : (
            <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1 fill-white" />
          )}
        </button>

        <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md text-xs text-gray-300">
          <AlertCircle className="h-3.5 w-3.5 text-primary-400" />
          <span>Video stream configured for PrepReach CDN (HLS/DASH)</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
        {/* Progress scrub bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer overflow-hidden">
          <div className="h-full bg-primary-500 w-1/4 rounded-full" />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button className="hover:text-white transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <Volume2 className="h-4 w-4" />
              <div className="w-12 h-1 bg-white/20 rounded-full">
                <div className="h-full bg-white w-2/3 rounded-full" />
              </div>
            </div>
            <span>04:15 / 18:30</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onComplete}
              className="text-[11px] font-semibold text-primary-300 hover:text-primary-200"
            >
              Mark Completed
            </button>
            <button className="hover:text-white transition-colors">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
