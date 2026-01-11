import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'paused' | 'active' | 'inactive';
  className?: string;
}

const statusConfig = {
  online: { label: 'Online', className: 'status-online' },
  offline: { label: 'Offline', className: 'status-offline' },
  paused: { label: 'Pausado', className: 'status-paused' },
  active: { label: 'Ativo', className: 'status-online' },
  inactive: { label: 'Inativo', className: 'status-offline' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === 'online' || status === 'active' ? 'bg-success animate-pulse' : '',
        status === 'paused' ? 'bg-yellow-400' : '',
        status === 'offline' || status === 'inactive' ? 'bg-muted-foreground' : ''
      )} />
      {config.label}
    </span>
  );
}
