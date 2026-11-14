import { cn } from '../../utils/cn';
import { Button } from './Button';
import { Icons } from './Icons';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We couldn\'t load the data. Please try again.', 
  onRetry, 
  retryLabel = 'Try Again',
  className 
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <Icons.alertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="default" className="mt-4" onClick={onRetry}>
          <Icons.refreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}