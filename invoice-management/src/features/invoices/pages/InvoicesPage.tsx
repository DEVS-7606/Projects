import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner } from "@/shared/components/atoms/Spinner";
import { Button } from "@/shared/components/atoms/Button";
import { Card } from "@/shared/components/atoms/Card";
import { EmptyState } from "@/shared/components/atoms/EmptyState";
import { SearchInput } from "@/shared/components/molecules/SearchInput";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { StatusBadge } from "@/shared/components/molecules/StatusBadge";
import { AddInvoiceModal } from "@/features/invoices/components/AddInvoiceModal";
import { useInvoices } from "@/hooks/useInvoices";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { InvoiceStatus, InvoiceSource } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all",
  );
  const [sourceFilter, setSourceFilter] = useState<InvoiceSource | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { invoices, total, loading, refetch } = useInvoices({
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    source: sourceFilter === "all" ? undefined : sourceFilter,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handleSaveInvoice = async () => {
    setShowAddModal(false);
    refetch();
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Invoices"
        subtitle="Manage and track all your invoices"
        action={
          <Button
            icon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
          >
            Add Invoice
          </Button>
        }
      />

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search by invoice # or vendor..."
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as InvoiceStatus | "all");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
              <option value="needs_review">Needs Review</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value as InvoiceSource | "all");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value="all">All Sources</option>
              <option value="email">Email</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <Button variant="secondary" icon={<Download size={16} />}>
            Export
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Due Date
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <EmptyState
                      title="No invoices found"
                      description="Try adjusting your filters or add a new invoice."
                    />
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="text-sm font-medium text-[#3b82f6] hover:text-[#2563eb]"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate">
                      {invoice.vendor?.name || "Unknown Vendor"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {invoice.invoice_date
                        ? formatDate(invoice.invoice_date)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {invoice.due_date ? formatDate(invoice.due_date) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize hidden sm:table-cell">
                      {invoice.source}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb]">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, total)} of {total} invoices
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-[#e5e7eb] rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#3b82f6] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-[#e5e7eb] rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {showAddModal && (
        <AddInvoiceModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
}
