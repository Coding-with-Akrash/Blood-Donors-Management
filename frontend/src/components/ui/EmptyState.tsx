import { cn } from '../../utils/cn';
import { Button } from './Button';
import { Icons } from './Icons';

interface EmptyStateProps {
  icon?: keyof typeof Icons;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'blood';
  };
  className?: string;
}

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  const Icon = Icons[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <Button
          variant={action.variant || 'default'}
          className="mt-4"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}