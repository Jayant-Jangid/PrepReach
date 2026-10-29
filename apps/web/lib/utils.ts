import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format duration in minutes → "Xh Ym" */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes === 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** Format price as Indian Rupee */
export function formatPrice(price: number): string {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

/** Human-readable exam category labels */
export const EXAM_CATEGORY_LABELS: Record<string, string> = {
  civil_service: 'Civil Service',
  public_banking: 'Public Banking',
  railway: 'Railway',
  municipal: 'Municipal',
}

/** Professional, subdued category badge colors */
export const EXAM_CATEGORY_COLORS: Record<string, string> = {
  civil_service: 'bg-slate-100 text-slate-800 border border-slate-300',
  public_banking: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  railway: 'bg-amber-50 text-amber-900 border border-amber-200',
  municipal: 'bg-primary-50 text-primary-800 border border-primary-200',
}

/** Truncate text to N chars */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

/** Format date as "DD MMM YYYY" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
