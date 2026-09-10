import { PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon = PackageSearch, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-20 text-center', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <Icon className="h-7 w-7 text-ink/30" strokeWidth={1.25} />
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink/55">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
