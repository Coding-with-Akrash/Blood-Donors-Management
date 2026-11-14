import { forwardRef, LabelHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };