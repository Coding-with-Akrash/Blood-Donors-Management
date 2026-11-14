import { forwardRef, HTMLAttributes, useId } from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/cn';
import { Icons } from './Icons';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', status, ...props }, ref) => {
    const sizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-24 w-24 text-2xl',
    };

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
      '2xl': 'h-5 w-5',
    };

    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
      away: 'bg-amber-500',
    };

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full', className)}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn('aspect-square h-full w-full object-cover', sizes[size])}
          />
        ) : (
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-muted',
              sizes[size]
            )}
          >
            {name ? (
              <span className="font-medium text-muted-foreground">
                {getInitials(name)}
              </span>
            ) : (
              <Icons.user className={cn('text-muted-foreground', sizes[size].replace('text-', '').replace('h-', '').replace('w-', ''))} aria-hidden="true" />
            )}
          </div>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-background',
              statusSizes[size],
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 5, size = 'md', ...props }, ref) => {
    const kids = React.Children.toArray(children);
    const visible = kids.slice(0, max);
    const remaining = kids.length - max;

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {visible.map((child, index) => (
          <span key={index} className="relative z-[auto]">
            {React.cloneElement(child as React.ReactElement, { size })}
          </span>
        ))}
        {remaining > 0 && (
          <span className="relative z-0">
            <div
              className={cn(
                'flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
                size === 'xs' && 'h-6 w-6 text-[10px]',
                size === 'sm' && 'h-8 w-8 text-xs',
                size === 'md' && 'h-10 w-10 text-sm',
                size === 'lg' && 'h-12 w-12 text-base',
                size === 'xl' && 'h-16 w-16 text-lg',
                size === '2xl' && 'h-24 w-24 text-xl'
              )}
            >
              +{remaining}
            </div>
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };