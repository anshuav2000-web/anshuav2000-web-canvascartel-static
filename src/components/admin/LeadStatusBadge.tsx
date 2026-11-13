import { Badge } from '@/components/ui/badge';

type LeadStatus = 'new' | 'in_progress' | 'closed';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
  },
  closed: {
    label: 'Closed',
    className: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
  }
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
