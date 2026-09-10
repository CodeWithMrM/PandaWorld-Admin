import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RatingStars({ rating = 0, reviewCount, size = 'sm', className }) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(starSize, i <= Math.round(rating) ? 'fill-ink text-ink' : 'fill-none text-ink/20')}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink/45">({reviewCount})</span>
      )}
    </div>
  );
}
