import './StatusBadge.css';

interface StatusBadgeProps {
  status: 'unpaid' | 'paid' | 'overdue' | 'needs_review';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    unpaid: { label: 'Unpaid', className: 'badge-unpaid' },
    paid: { label: 'Paid', className: 'badge-paid' },
    overdue: { label: 'Overdue', className: 'badge-overdue' },
    needs_review: { label: 'Needs Review', className: 'badge-needs-review' },
  };

  const config = statusConfig[status];

  return <span className={`status-badge ${config.className}`}>{config.label}</span>;
}
