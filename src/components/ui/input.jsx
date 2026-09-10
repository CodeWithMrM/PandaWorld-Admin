import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-13 w-full rounded-sm border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/35 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-50',
      error ? 'border-accent focus-visible:ring-accent' : 'border-border focus:border-ink',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[120px] w-full rounded-sm border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/35 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-50',
      error ? 'border-accent focus-visible:ring-accent' : 'border-border focus:border-ink',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-[13px] font-medium text-ink/70', className)}
    {...props}
  />
));
Label.displayName = 'Label';

/**
 * A self-contained floating-label field: the label sits inside the input
 * at rest and floats above it once focused/filled. Wraps Input above.
 */
const FloatingField = React.forwardRef(
  ({ label, id, className, error, helperText, ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(Boolean(props.value || props.defaultValue));
    return (
      <div className={cn('relative', className)}>
        <input
          id={id}
          ref={ref}
          className={cn(
            'peer flex h-14 w-full rounded-sm border bg-white px-4 pt-4 text-[15px] text-ink transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink placeholder-transparent',
            error ? 'border-accent focus-visible:ring-accent' : 'border-border focus:border-ink'
          )}
          placeholder={label}
          onChange={(e) => {
            setHasValue(Boolean(e.target.value));
            props.onChange?.(e);
          }}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-4 top-4 text-[15px] text-ink/40 transition-all duration-200 ease-premium',
            'peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-ink/60',
            hasValue && 'top-2 text-[11px] text-ink/60'
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1.5 text-xs font-medium text-accent">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-ink/45">{helperText}</p>}
      </div>
    );
  }
);
FloatingField.displayName = 'FloatingField';

export { Input, Textarea, Label, FloatingField };
