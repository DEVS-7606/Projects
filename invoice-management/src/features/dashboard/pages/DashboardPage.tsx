import { useState, useEffect } from 'react';
import StatsCard from '@/shared/components/StatsCard/StatsCard';
import DataTable from '@/shared/components/DataTable/DataTable';
import StatusBadge from '@/shared/components/StatusBadge/StatusBadge';
import type { Invoice, DashboardStats } from '@/types';
import '../styles/DashboardPage.css';

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>({
    total_invoices: 0,
    unpaid_amount: 0,
    overdue_amount: 0,
    paid_this_month: 0,
  });

  const [recentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch dashboard stats and recent invoices from Supabase
    setLoading(false);
  }, []);

  const invoiceColumns = [
    { key: 'invoice_number' as const, label: 'Invoice #', width: '100px' },
    { key: 'vendor_id' as const, label: 'Vendor', width: '150px' },
    { key: 'invoice_date' as const, label: 'Date', width: '100px' },
    { key: 'due_date' as const, label: 'Due Date', width: '100px' },
    {
      key: 'total_amount' as const,
      label: 'Amount',
      width: '100px',
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
    {
      key: 'status' as const,
      label: 'Status',
      width: '120px',
      render: (value: Invoice['status']) => <StatusBadge status={value} />,
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your invoice overview.</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          label="Total Invoices"
          value={stats.total_invoices}
          icon="📊"
          trend="neutral"
        />
        <StatsCard
          label="Unpaid Amount"
          value={`₹${stats.unpaid_amount.toFixed(2)}`}
          icon="⏳"
          trend="down"
        />
        <StatsCard
          label="Overdue Amount"
          value={`₹${stats.overdue_amount.toFixed(2)}`}
          icon="⚠️"
          trend="down"
        />
        <StatsCard
          label="Paid This Month"
          value={`₹${stats.paid_this_month.toFixed(2)}`}
          icon="✅"
          trend="up"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Invoices</h2>
          <a href="/invoices" className="view-all-link">
            View all →
          </a>
        </div>
        <DataTable
          columns={invoiceColumns}
          data={recentInvoices.slice(0, 5)}
          loading={loading}
          emptyMessage="No invoices yet. Start by forwarding an invoice email."
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <button className="action-button">+ Add Invoice</button>
          <button className="action-button">+ Add Vendor</button>
          <button className="action-button secondary">📋 Copy Forwarding Email</button>
        </div>
      </div>
    </div>
  );
}
