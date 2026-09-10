import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold tracking-wide transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        // Signature PandaWorld button: transparent, thin black border, fills black on hover.
        default:
          'border border-ink bg-transparent text-ink hover:bg-ink hover:text-white active:scale-[0.98]',
        // Already-filled black — used sparingly for the single most important CTA on a page.
        solid: 'bg-ink text-white border border-ink hover:bg-black/85 active:scale-[0.98]',
        // Red outline for urgent/critical actions (place order, complete payment).
        accent:
          'border border-accent text-accent bg-transparent hover:bg-accent hover:text-white active:scale-[0.98]',
        ghost: 'text-ink hover:bg-surface-muted border border-transparent',
        link: 'text-ink underline-offset-4 hover:underline p-0 h-auto font-medium',
        subtle: 'bg-surface-muted text-ink border border-transparent hover:bg-surface',
      },
      size: {
        default: 'h-12 px-7',
        sm: 'h-10 px-5 text-[13px]',
        lg: 'h-14 px-9 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
