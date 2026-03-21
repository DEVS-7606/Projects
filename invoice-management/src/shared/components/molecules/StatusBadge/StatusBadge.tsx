import { Badge } from '@/shared/components/atoms/Badge';
import type { InvoiceStatus } from '@/types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig: Record<InvoiceStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
  paid: { label: 'Paid', variant: 'success' },
  unpaid: { label: 'Unpaid', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'danger' },
  needs_review: { label: 'Needs Review', variant: 'info' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
