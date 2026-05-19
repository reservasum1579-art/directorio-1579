import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({
  src,
  firstName = '',
  lastName = '',
  size = 'md',
  className,
}: AvatarProps) {
  const initials = getInitials(firstName || '?', lastName || '?');

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cn(
          'rounded-full object-cover ring-2 ring-surface shadow-xs',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        'bg-primary-100 text-primary-700 font-semibold',
        'ring-2 ring-surface shadow-xs',
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
