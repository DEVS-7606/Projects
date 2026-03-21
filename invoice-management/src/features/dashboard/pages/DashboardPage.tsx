import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Plus,
  Building2,
  Mail,
  Clock,
  Search,
  TrendingDown,
} from "lucide-react";
import { Spinner } from "@/shared/components/atoms/Spinner";
import { Button } from "@/shared/components/atoms/Button";
import { Card, CardContent } from "@/shared/components/atoms/Card";
import { StatCard } from "@/shared/components/molecules/StatCard";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { RecentInvoicesTable } from "@/features/dashboard/components/RecentInvoicesTable";
import { AddInvoiceModal } from "@/features/invoices/components/AddInvoiceModal";
import { useDashboard } from "@/hooks/useDashboard";
import { useInvoices } from "@/hooks/useInvoices";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/hooks/useAuth";

const FORWARDING_EMAIL = "invoices@yourdomain.com";

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboard();
  const {
    invoices,
    loading: invoicesLoading,
    refetch: refetchInvoices,
  } = useInvoices({ limit: 5 });
  const { user } = useAuth();

  const loading = statsLoading || invoicesLoading;

  const handleCopy = () => {
    const email = user?.forwarding_email || FORWARDING_EMAIL;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveInvoice = async () => {
    setShowAddModal(false);
    refetchInvoices();
    refetchStats();
  };

  if (loading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Error loading dashboard: {statsError}
          </p>
          <button
            onClick={refetchStats}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Here's what's happening with your invoices today."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Invoices"
          value={stats?.total_invoices ?? 0}
          icon={<FileText size={20} className="text-[#3b82f6]" />}
          iconBgColor="bg-[#3b82f6]/10"
        />
        <StatCard
          title="Unpaid Amount"
          value={formatCurrency(stats?.unpaid_amount ?? 0)}
          icon={<TrendingDown size={20} className="text-[#f59e0b]" />}
          iconBgColor="bg-[#f59e0b]/10"
          subtitle={`${stats?.unpaid_count ?? 0} invoices`}
        />
        <StatCard
          title="Overdue Amount"
          value={formatCurrency(stats?.overdue_amount ?? 0)}
          icon={<AlertTriangle size={20} className="text-[#ef4444]" />}
          iconBgColor="bg-[#ef4444]/10"
          subtitle={`${stats?.overdue_count ?? 0} invoices`}
        />
        <StatCard
          title="Paid This Month"
          value={formatCurrency(stats?.paid_this_month ?? 0)}
          icon={<CheckCircle size={20} className="text-[#10b981]" />}
          iconBgColor="bg-[#10b981]/10"
          subtitle={`${stats?.paid_count ?? 0} invoices`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RecentInvoicesTable invoices={invoices} />

          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-[#1f2937] mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<Plus size={16} />}
                  onClick={() => setShowAddModal(true)}
                >
                  Add Invoice
                </Button>
                <Link to="/vendors">
                  <Button variant="secondary" icon={<Building2 size={16} />}>
                    Add Vendor
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  icon={
                    copied ? (
                      <Check size={16} className="text-[#10b981]" />
                    ) : (
                      <Copy size={16} />
                    )
                  }
                >
                  {copied ? "Copied!" : "Copy Email"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-[#1f2937] mb-1">
                Get Started
              </h2>
              <p className="text-xs text-gray-500 mb-5">
                Forward invoices to your unique email address
              </p>

              <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2.5 mb-6">
                <Mail size={14} className="text-[#3b82f6] shrink-0" />
                <span className="text-xs text-gray-700 flex-1 truncate font-mono">
                  {user?.forwarding_email || FORWARDING_EMAIL}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-1 text-gray-400 hover:text-[#3b82f6] transition-colors"
                  title="Copy email"
                >
                  {copied ? (
                    <Check size={14} className="text-[#10b981]" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    color: "bg-[#3b82f6]/10 text-[#3b82f6]",
                    title: "Forward invoice email",
                    desc: "Forward any supplier invoice email to your unique address",
                  },
                  {
                    icon: Clock,
                    color: "bg-[#f59e0b]/10 text-[#f59e0b]",
                    title: "Wait for processing",
                    desc: "System extracts data automatically in under 60 seconds",
                  },
                  {
                    icon: Search,
                    color: "bg-[#10b981]/10 text-[#10b981]",
                    title: "Review in dashboard",
                    desc: "Verify extracted data and manage payment status",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 ${step.color} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <step.icon size={14} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-[#1f2937] mb-4">
                Invoice Status
              </h2>
              <div className="space-y-3">
                {(
                  [
                    { key: "paid", label: "Paid", color: "bg-[#10b981]" },
                    { key: "unpaid", label: "Unpaid", color: "bg-[#f59e0b]" },
                    { key: "overdue", label: "Overdue", color: "bg-[#ef4444]" },
                    {
                      key: "needs_review",
                      label: "Needs Review",
                      color: "bg-[#8b5cf6]",
                    },
                  ] as const
                ).map(({ key, label, color }) => {
                  const count = invoices.filter((i) => i.status === key).length;
                  const total = invoices.length;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-medium text-gray-800">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAddModal && (
        <AddInvoiceModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
}
