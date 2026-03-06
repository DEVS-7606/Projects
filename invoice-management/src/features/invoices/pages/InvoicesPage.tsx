import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/shared/components/DataTable/DataTable';
import FilterBar from '@/shared/components/FilterBar/FilterBar';
import StatusBadge from '@/shared/components/StatusBadge/StatusBadge';
import type { Invoice, InvoiceFilters } from '@/types';
import '../styles/InvoicesPage.css';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch invoices from Supabase with filters
    setLoading(false);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<InvoiceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

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
    {
      key: 'source' as const,
      label: 'Source',
      width: '80px',
      render: (value: string) => (value === 'email' ? '📧' : '✏️'),
    },
  ];

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1>Invoices</h1>
        <button className="add-button" onClick={() => navigate('/invoices/new')}>
          + Add Invoice
        </button>
      </div>

      <FilterBar>
        <input
          type="text"
          placeholder="Search invoices..."
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
        <select onChange={(e) => handleFilterChange({ status: e.target.value as any })}>
          <option value="">All Status</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="needs_review">Needs Review</option>
        </select>
        <select onChange={(e) => handleFilterChange({ source: e.target.value as any })}>
          <option value="">All Sources</option>
          <option value="email">Email</option>
          <option value="manual">Manual</option>
        </select>
      </FilterBar>

      <DataTable
        columns={invoiceColumns}
        data={invoices}
        loading={loading}
        emptyMessage="No invoices found. Start by forwarding an invoice email."
        onRowClick={(invoice) => navigate(`/invoices/${invoice.id}`)}
      />
    </div>
  );
}
