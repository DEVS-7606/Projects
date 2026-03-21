import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/atoms/Card';
import { StatusBadge } from '@/shared/components/molecules/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { InvoiceWithVendor } from '@/types';

interface RecentInvoicesTableProps {
  invoices: InvoiceWithVendor[];
}

export function RecentInvoicesTable({ invoices }: RecentInvoicesTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-base font-semibold text-[#1f2937]">Recent Invoices</h2>
        <Link
          to="/invoices"
          className="flex items-center gap-1 text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Due Date</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <td className="px-6 py-4 text-sm font-medium text-[#3b82f6]">
                  {invoice.invoice_number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-[160px] truncate">
                  {invoice.vendor?.name || 'Unknown Vendor'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                  {invoice.invoice_date ? formatDate(invoice.invoice_date) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                  {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(invoice.total_amount || 0)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
