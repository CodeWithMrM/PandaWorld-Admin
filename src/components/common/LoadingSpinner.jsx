import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function LoadingSpinner({ className = 'h-6 w-6' }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-ink/15 border-t-ink ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-ink/45">
      <Link to="/" className="transition-colors hover:text-ink">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
