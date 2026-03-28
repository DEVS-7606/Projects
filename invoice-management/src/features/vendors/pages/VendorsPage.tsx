import { VendorModal } from "@/features/vendors/components/VendorModal";
import { useVendors } from "@/hooks/useVendors";
import { vendorApi } from "@/services/vendor.api";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { Card } from "@/shared/components/atoms/Card";
import { EmptyState } from "@/shared/components/atoms/EmptyState";
import { Spinner } from "@/shared/components/atoms/Spinner";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { SearchInput } from "@/shared/components/molecules/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { CreateVendorRequest, UpdateVendorRequest, Vendor } from "@/types";
import {
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { vendors, loading, refetch } = useVendors();

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        vendor.name.toLowerCase().includes(query) ||
        (vendor.email?.toLowerCase().includes(query) ?? false) ||
        (vendor.gstin?.toLowerCase().includes(query) ?? false);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && vendor.is_active) ||
        (statusFilter === "inactive" && !vendor.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchQuery, statusFilter]);

  const activeCount = vendors.filter((v) => v.is_active).length;

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowAddModal(true);
  };

  const handleDelete = async (vendorId: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        await vendorApi.remove(vendorId);
        refetch();
      } catch (err) {
        console.error("Failed to delete vendor:", err);
      }
    }
  };

  const handleSave = async (
    data: CreateVendorRequest | UpdateVendorRequest,
  ) => {
    try {
      if (selectedVendor) {
        await vendorApi.update(selectedVendor.id, data);
      } else {
        await vendorApi.create(data as CreateVendorRequest);
      }
      setShowAddModal(false);
      setSelectedVendor(null);
      refetch();
    } catch (err) {
      console.error("Failed to save vendor:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Vendors"
        subtitle="Manage your vendor relationships"
        action={
          <Button
            icon={<Plus size={16} />}
            onClick={() => {
              setSelectedVendor(null);
              setShowAddModal(true);
            }}
          >
            Add Vendor
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">Total Vendors</div>
          <div className="text-xl font-bold text-[#1f2937]">
            {vendors.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">Active Vendors</div>
          <div className="text-xl font-bold text-[#10b981]">{activeCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">Inactive Vendors</div>
          <div className="text-xl font-bold text-gray-500">
            {vendors.length - activeCount}
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, email, or GSTIN..."
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onValueChange={(val) =>
                setStatusFilter(val as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12">
              <EmptyState
                icon={<Building2 size={48} />}
                title="No vendors found"
                description="Try adjusting your filters or add a new vendor."
              />
            </Card>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-1 truncate">
                    {vendor.name}
                  </h3>
                  <Badge variant={vendor.is_active ? "success" : "neutral"}>
                    {vendor.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="p-2 text-gray-400 hover:text-[#3b82f6] hover:bg-[#3b82f6]/5 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="p-2 text-gray-400 hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {vendor.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                {vendor.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{vendor.address}</span>
                  </div>
                )}
              </div>

              {vendor.gstin && (
                <div className="pt-3 border-t border-[#e5e7eb]">
                  <div className="text-xs text-gray-500 mb-1">GSTIN</div>
                  <div className="text-xs font-mono text-gray-700">
                    {vendor.gstin}
                  </div>
                </div>
              )}

              {vendor.default_payment_terms_days != null && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">
                    Payment Terms: {vendor.default_payment_terms_days} days
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {showAddModal && (
        <VendorModal
          vendor={selectedVendor}
          onClose={() => {
            setShowAddModal(false);
            setSelectedVendor(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
