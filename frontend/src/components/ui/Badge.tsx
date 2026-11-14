import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { getStatusColor, getStatusIcon } from '../../utils/cn';
import { Icons } from './Icons';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'blood' | 'success' | 'warning' | 'info';
  status?: string;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, children, ...props }, ref) => {
    const variants = {
      default: 'bg-primary/10 text-primary border border-primary/20',
      secondary: 'bg-secondary text-secondary-foreground border border-border',
      destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
      outline: 'text-foreground border border-border',
      blood: 'bg-blood-light text-blood-red border border-blood-red/20',
      success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    };

    let badgeClass = variants[variant];
    
    if (status) {
      badgeClass = getStatusColor(status);
    }

    const Icon = status ? Icons[getStatusIcon(status)] : null;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
          badgeClass,
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };

interface BloodGroupBadgeProps {
  bloodGroup: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const bloodGroupIcons: Record<string, string> = {
  'A+': 'A+',
  'A-': 'A-',
  'B+': 'B+',
  'B-': 'B-',
  'AB+': 'AB+',
  'AB-': 'AB-',
  'O+': 'O+',
  'O-': 'O-',
};

export function BloodGroupBadge({ bloodGroup, size = 'md', showIcon = true }: BloodGroupBadgeProps) {
  const colorClass = getBloodGroupColor(bloodGroup);
  const icon = bloodGroupIcons[bloodGroup] || bloodGroup;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-semibold', colorClass, sizes[size])}>
      {showIcon && <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/30 text-xs">{icon}</span>}
      <span>{bloodGroup}</span>
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const iconName = getStatusIcon(status);
  const Icon = Icons[iconName];

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', colorClass, sizes[size])}>
      <Icon className={cn(iconSizes[size], 'flex-shrink-0')} aria-hidden="true" />
      <span className="capitalize">{status.toLowerCase().replace(/_/g, ' ')}</span>
    </span>
  );
}