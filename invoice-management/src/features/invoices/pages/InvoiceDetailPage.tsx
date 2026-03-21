import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Building2,
  Mail,
  Phone,
  MapPin,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Spinner } from "@/shared/components/atoms/Spinner";
import { Button } from "@/shared/components/atoms/Button";
import { Card, CardContent } from "@/shared/components/atoms/Card";
import { EmptyState } from "@/shared/components/atoms/EmptyState";
import { StatusBadge } from "@/shared/components/molecules/StatusBadge";
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import { invoiceApi } from "@/services/invoice.api";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoice, loading, error } = useInvoiceDetail(id);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      await invoiceApi.remove(id);
      navigate("/invoices");
    } catch (err) {
      console.error("Failed to delete invoice:", err);
    }
  };

  const handleMarkPaid = async () => {
    if (!id) return;
    try {
      await invoiceApi.update(id, {
        status: "paid",
        paid_at: new Date().toISOString(),
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to mark as paid:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto">
        <Card className="p-12">
          <EmptyState
            icon={<FileText size={48} />}
            title="Invoice Not Found"
            description={
              error || "The invoice you're looking for doesn't exist."
            }
          />
          <div className="text-center mt-6">
            <Link to="/invoices">
              <Button icon={<ArrowLeft size={16} />}>Back to Invoices</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Invoices
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1f2937] mb-2">
              Invoice {invoice.invoice_number}
            </h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={invoice.status} />
              <span className="text-sm text-gray-500 capitalize">
                Source: {invoice.source}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<Download size={16} />}>
              Download
            </Button>
            <Button variant="secondary" icon={<Edit size={16} />}>
              Edit
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-[#1f2937] mb-6">
                Invoice Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Invoice Number
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Invoice Date</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {invoice.invoice_date
                      ? formatDate(invoice.invoice_date)
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Due Date</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {invoice.due_date ? formatDate(invoice.due_date) : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Currency</div>
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.currency}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-[#1f2937] mb-6 flex items-center gap-2">
                <Building2 size={20} />
                Vendor Information
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Vendor Name</div>
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.vendor?.name || "Unknown Vendor"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {invoice.vendor?.email && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Mail size={12} /> Email
                      </div>
                      <div className="text-sm text-gray-900">
                        {invoice.vendor.email}
                      </div>
                    </div>
                  )}
                  {invoice.vendor?.phone && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Phone size={12} /> Phone
                      </div>
                      <div className="text-sm text-gray-900">
                        {invoice.vendor.phone}
                      </div>
                    </div>
                  )}
                </div>
                {invoice.vendor?.address && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Address
                    </div>
                    <div className="text-sm text-gray-900">
                      {invoice.vendor.address}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-[#1f2937] mb-6">
                Amount Breakdown
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.subtotal ?? 0)}
                  </span>
                </div>

                {(invoice.cgst_amount ?? 0) > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">CGST</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.cgst_amount ?? 0)}
                    </span>
                  </div>
                )}

                {(invoice.sgst_amount ?? 0) > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">SGST</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.sgst_amount ?? 0)}
                    </span>
                  </div>
                )}

                {(invoice.igst_amount ?? 0) > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">IGST</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.igst_amount ?? 0)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-t border-[#e5e7eb]">
                  <span className="text-sm font-medium text-gray-600">
                    Total Tax
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.tax_total ?? 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-t-2 border-[#e5e7eb]">
                  <span className="text-base font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-[#3b82f6]">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {invoice.status === "paid" && invoice.payment_reference && (
            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-[#10b981] mb-4 flex items-center gap-2">
                <CheckCircle size={16} />
                Payment Received
              </h3>
              <div className="space-y-3">
                {invoice.paid_at && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">
                      Payment Date
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(invoice.paid_at)}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-600 mb-1">Reference</div>
                  <div className="text-sm font-mono text-gray-900">
                    {invoice.payment_reference}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Invoice Created
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(invoice.created_at)}
                    </div>
                  </div>
                </div>
                {invoice.status === "paid" && invoice.paid_at && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Payment Received
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(invoice.paid_at)}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Last Updated
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(invoice.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {invoice.status !== "paid" && (
                  <Button
                    variant="primary"
                    icon={<CheckCircle size={16} />}
                    onClick={handleMarkPaid}
                    className="w-full justify-center bg-[#10b981] hover:bg-[#059669]"
                  >
                    Mark as Paid
                  </Button>
                )}
                <Button
                  variant="secondary"
                  icon={<Mail size={16} />}
                  className="w-full justify-center"
                >
                  Send Reminder
                </Button>
                <Button
                  variant="secondary"
                  icon={<FileText size={16} />}
                  className="w-full justify-center"
                >
                  View PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {invoice.duplicate_status === "duplicate" &&
            invoice.duplicate_of_invoice_id && (
              <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-[#f59e0b] mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Possible Duplicate
                </h3>
                <p className="text-xs text-gray-600">
                  This invoice may be a duplicate of another invoice.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
