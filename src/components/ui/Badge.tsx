import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-background text-text-secondary border border-border',
  success: 'bg-success-50 text-success-700 border border-success-500/20',
  warning: 'bg-warning-50 text-warning-700 border border-warning-500/20',
  error: 'bg-error-50 text-error-700 border border-error-500/20',
  info: 'bg-info-50 text-info-500 border border-info-500/20',
  accent: 'bg-accent-50 text-accent-800 border border-accent-300/30',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-text-muted',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  accent: 'bg-accent-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-[--radius-full] whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}

// Pre-configured status badges for common use cases
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'Pendiente' },
    approved: { variant: 'success', label: 'Aprobado' },
    completed: { variant: 'success', label: 'Completado' },
    cancelled: { variant: 'default', label: 'Cancelado' },
    rejected: { variant: 'error', label: 'Rechazado' },
    blocked: { variant: 'error', label: 'Bloqueado' },
    draft: { variant: 'default', label: 'Borrador' },
    published: { variant: 'success', label: 'Publicado' },
    archived: { variant: 'default', label: 'Archivado' },
    sold: { variant: 'accent', label: 'Vendido' },
    paused: { variant: 'warning', label: 'Pausado' },
    open: { variant: 'warning', label: 'Abierto' },
    investigating: { variant: 'info', label: 'Investigando' },
    resolved: { variant: 'success', label: 'Resuelto' },
    dismissed: { variant: 'default', label: 'Descartado' },
    applied: { variant: 'error', label: 'Aplicada' },
    paid: { variant: 'success', label: 'Pagada' },
    waived: { variant: 'default', label: 'Eximida' },
    appealed: { variant: 'warning', label: 'Apelada' },
    retained: { variant: 'error', label: 'Retenido' },
    partial: { variant: 'warning', label: 'Parcial' },
    returned: { variant: 'success', label: 'Devuelto' },
  };

  const { variant, label } = config[status] || {
    variant: 'default' as BadgeVariant,
    label: status,
  };

  return <Badge variant={variant} dot>{label}</Badge>;
}
