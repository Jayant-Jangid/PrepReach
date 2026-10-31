import React from 'react'
import { Radio, Calendar, Clock, Video } from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface LiveClassBannerProps {
  title: string
  courseTitle: string
  instructorName: string
  scheduledAt: string
  joinUrl?: string
}

export default function LiveClassBanner({
  title,
  courseTitle,
  instructorName,
  scheduledAt,
  joinUrl,
}: LiveClassBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent-200 bg-gradient-to-r from-accent-50/60 via-white to-primary-50/40 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-bold text-accent-700 uppercase tracking-wider">
              <Radio className="h-3 w-3 animate-pulse text-accent-600" />
              Live Interactive Session
            </span>
            <span className="text-xs text-gray-500 font-medium">{courseTitle}</span>
          </div>

          <h3 className="text-base font-bold text-foreground">{title}</h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary-500" />
              <span>{formatDate(scheduledAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary-500" />
              <span>
                {new Date(scheduledAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <span>• Faculty: {instructorName}</span>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Video className="h-4 w-4" />}
            onClick={() => {
              if (joinUrl) window.open(joinUrl, '_blank')
            }}
          >
            Join Live Room
          </Button>
        </div>
      </div>
    </div>
  )
}
