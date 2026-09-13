import { useState } from 'react';
import { toast } from 'sonner';
import { Info, Check, X, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/product/RatingStars';
import { formatDate } from '@/lib/utils';

const MOCK_REVIEWS = [
  { id: 1, product: 'Wireless Headphones', customer: 'Aisha K.', rating: 5, status: 'pending', comment: 'Sound quality is incredible for the price, and they arrived faster than expected!', date: '2026-07-15' },
  { id: 2, product: 'Smart Watch', customer: 'Thabo M.', rating: 2, status: 'pending', comment: 'Battery life is way shorter than advertised. Disappointed.', date: '2026-07-14' },
  { id: 3, product: "Men's Denim Jacket", customer: 'Lerato N.', rating: 4, status: 'approved', comment: 'Great fit, exactly as pictured. Would size up if between sizes.', date: '2026-07-10' },
  { id: 4, product: 'Non-stick Frying Pan', customer: 'Sipho D.', rating: 5, status: 'approved', comment: 'Best pan I have owned. Nothing sticks, even eggs.', date: '2026-07-08' },
];

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const setStatus = (id, status) => {
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Review ${status} (local demo only)`);
  };

  const removeReview = (id) => {
    setReviews((rs) => rs.filter((r) => r.id !== id));
    toast('Review deleted (local demo only)');
  };

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate customer product reviews." />

      <div className="mb-6 flex items-start gap-3 rounded-md border border-accent/30 bg-accent/5 p-4 text-sm text-ink/70">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p>
          The backend doesn't have a Review model yet, so this page shows sample data to
          demonstrate the moderation UX — actions here don't persist. Add a Review model
          (linked to Product and User) and a moderation endpoint to make this real.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-md border border-border bg-white p-5">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink">{review.product}</p>
                <p className="text-xs text-ink/45">
                  {review.customer} · {formatDate(review.date)}
                </p>
              </div>
              <Badge variant={review.status === 'approved' ? 'success' : review.status === 'pending' ? 'accentOutline' : 'ink'}>
                {review.status}
              </Badge>
            </div>
            <RatingStars rating={review.rating} className="mb-2" />
            <p className="mb-4 text-sm text-ink/70">{review.comment}</p>
            <div className="flex flex-wrap items-center gap-2">
              {review.status !== 'approved' && (
                <button
                  onClick={() => setStatus(review.id, 'approved')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              )}
              {review.status !== 'rejected' && (
                <button
                  onClick={() => setStatus(review.id, 'rejected')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
              )}
              <button
                onClick={() => removeReview(review.id)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full p-2 text-ink/40 transition-colors hover:bg-surface-muted hover:text-accent"
                aria-label="Delete review"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
