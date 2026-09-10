import { cn } from '@/lib/utils';

export function StatCard({ icon: Icon, label, value, trend, trendLabel, accent = false }) {
  return (
    <div className="rounded-md border border-border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            accent ? 'bg-accent/10' : 'bg-surface-muted'
          )}
        >
          <Icon className={cn('h-5 w-5', accent ? 'text-accent' : 'text-ink')} />
        </div>
        {trend !== undefined && (
          <span className={cn('text-xs font-bold', trend >= 0 ? 'text-success' : 'text-accent')}>
            {trend >= 0 ? '+' : ''}
            {trend}% {trendLabel}
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium text-ink/50">{label}</p>
    </div>
  );
}
