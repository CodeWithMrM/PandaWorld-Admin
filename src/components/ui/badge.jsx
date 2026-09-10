import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide leading-none',
  {
    variants: {
      variant: {
        accent: 'bg-accent text-white', // sale, discount, new alerts
        accentOutline: 'border border-accent text-accent bg-white',
        ink: 'bg-ink text-white', // neutral status: e.g. "Sold Out"
        outline: 'border border-ink/20 text-ink/70 bg-white',
        success: 'bg-success/10 text-success',
        muted: 'bg-surface-muted text-ink/60',
      },
    },
    defaultVariants: { variant: 'ink' },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
