import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary-500', sizeStyles[size], className)}
    />
  );
}

export function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-border-light" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
      {message && (
        <p className="text-sm text-text-secondary animate-fade-in">{message}</p>
      )}
    </div>
  );
}

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-shimmer rounded-[--radius-md]', className)}
      {...props}
    />
  );
}
