import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes intelligently, resolving conflicts (e.g.
 * "px-2 px-4" -> "px-4"). Standard shadcn/ui helper.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Formats a number as ZAR currency, e.g. 1299.5 -> "R 1,299.50" */
export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'narrowSymbol',
  })
    .format(value)
    .replace('ZAR', 'R');
}

/** Formats an ISO date string as "12 Jul 2026" */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Truncates text to a maximum length with an ellipsis. */
export function truncate(text = '', max = 80) {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
