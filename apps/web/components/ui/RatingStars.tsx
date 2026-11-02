import { Star } from 'lucide-react'

export default function RatingStars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-current' : 'text-slate-300'}`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">({count})</span>
      )}
    </div>
  )
}
