import { cn } from '../../utils/cn';
import { Icons } from './Icons';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ message = 'Loading...', size = 'md', className }: LoadingStateProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      <div className="relative">
        <Icons.loader className={cn(sizes[size], 'animate-spin text-primary')} aria-hidden="true" />
        <span className="sr-only">{message}</span>
      </div>
      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingState size="lg" message="Loading LifeBlood..." />
    </div>
  );
}

export function InlineLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Icons.loader className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}