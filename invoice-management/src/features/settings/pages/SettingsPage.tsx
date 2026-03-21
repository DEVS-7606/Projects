import { useState } from "react";
import { User, Building2, Bell, Mail, Save, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import type { User as UserType } from "@/types";

const FORWARDING_EMAIL = "invoices@yourdomain.com";

type TabType = "profile" | "business" | "notifications" | "email";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { user } = useAuth();

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "business" as TabType, label: "Business", icon: Building2 },
    { id: "notifications" as TabType, label: "Notifications", icon: Bell },
    { id: "email" as TabType, label: "Email Setup", icon: Mail },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and application settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#3b82f6] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && <ProfileSettings user={user} />}
          {activeTab === "business" && <BusinessSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "email" && <EmailSettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }: { user: UserType | null }) {
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save profile:", formData);
    // TODO: Implement save functionality
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#1f2937] mb-6">
        Profile Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-[#e5e7eb]">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Business Settings Component
function BusinessSettings() {
  const [formData, setFormData] = useState({
    businessName: "",
    gstin: "",
    pan: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save business:", formData);
    // TODO: Implement save functionality
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#1f2937] mb-6">
        Business Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Business Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="Your Business Pvt Ltd"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                GSTIN
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) =>
                  setFormData({ ...formData, gstin: e.target.value })
                }
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                PAN
              </label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) =>
                  setFormData({ ...formData, pan: e.target.value })
                }
                placeholder="ABCDE1234F"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Business Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Business Street"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Mumbai"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                placeholder="Maharashtra"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                placeholder="400001"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="business@example.com"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-[#e5e7eb]">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    invoiceReceived: true,
    paymentReceived: true,
    invoiceOverdue: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save notifications:", settings);
    // TODO: Implement save functionality
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#1f2937] mb-6">
        Notification Preferences
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Email Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Enable Email Notifications
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Receive notifications via email
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#3b82f6] border-gray-300 rounded focus:ring-[#3b82f6]"
              />
            </label>
          </div>
        </div>

        {/* Invoice Notifications */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Invoice Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  New Invoice Received
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Get notified when a new invoice is received
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.invoiceReceived}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    invoiceReceived: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#3b82f6] border-gray-300 rounded focus:ring-[#3b82f6]"
              />
            </label>
            <label className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Payment Received
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Get notified when a payment is received
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.paymentReceived}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    paymentReceived: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#3b82f6] border-gray-300 rounded focus:ring-[#3b82f6]"
              />
            </label>
            <label className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Invoice Overdue
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Get notified when an invoice becomes overdue
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.invoiceOverdue}
                onChange={(e) =>
                  setSettings({ ...settings, invoiceOverdue: e.target.checked })
                }
                className="w-5 h-5 text-[#3b82f6] border-gray-300 rounded focus:ring-[#3b82f6]"
              />
            </label>
          </div>
        </div>

        {/* Reports */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Reports</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Weekly Report
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Receive a weekly summary of your invoices
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyReport}
                onChange={(e) =>
                  setSettings({ ...settings, weeklyReport: e.target.checked })
                }
                className="w-5 h-5 text-[#3b82f6] border-gray-300 rounded focus:ring-[#3b82f6]"
              />
            </label>
            <label className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Monthly Report
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Receive a monthly summary of your invoices
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.monthlyReport}
                onChange={(e) =>
                  setSettings({ ...settings, monthlyReport: e.target.checked })
                }
                className="w-5 h-5 text-[#3b82f6] border-gray-300 rounded focus:ring-[#3b82f6]"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-[#e5e7eb]">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

// Email Settings Component
function EmailSettings() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FORWARDING_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#1f2937] mb-6">
        Email Forwarding Setup
      </h2>

      <div className="space-y-6">
        {/* Forwarding Email */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Your Forwarding Email
          </h3>
          <div className="flex items-center gap-3 p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg">
            <Mail size={20} className="text-[#3b82f6] shrink-0" />
            <span className="flex-1 text-sm font-mono text-gray-700">
              {FORWARDING_EMAIL}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-[#10b981]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Forward your invoice emails to this address for automatic processing
          </p>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            How to Set Up
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Copy Your Forwarding Email
                </div>
                <div className="text-sm text-gray-600">
                  Click the copy button above to copy your unique forwarding
                  email address
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Set Up Email Forwarding
                </div>
                <div className="text-sm text-gray-600">
                  In your email client (Gmail, Outlook, etc.), set up a filter
                  to automatically forward invoice emails to this address
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Automatic Processing
                </div>
                <div className="text-sm text-gray-600">
                  Once set up, all forwarded invoices will be automatically
                  extracted and added to your dashboard
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gmail Instructions */}
        <div className="bg-[#eff6ff] border border-[#3b82f6]/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#1f2937] mb-2">
            Gmail Setup Instructions
          </h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Open Gmail Settings → Filters and Blocked Addresses</li>
            <li>Click "Create a new filter"</li>
            <li>In "Has the words" field, enter: invoice OR bill</li>
            <li>Click "Create filter"</li>
            <li>Check "Forward it to" and paste your forwarding email</li>
            <li>Click "Create filter"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
