import { useState } from 'react';
import { Modal } from '@/shared/components/atoms/Modal';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import type { Vendor, CreateVendorRequest, UpdateVendorRequest } from '@/types';

interface VendorModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onSave: (data: CreateVendorRequest | UpdateVendorRequest) => void;
}

export function VendorModal({ vendor, onClose, onSave }: VendorModalProps) {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    gstin: vendor?.gstin || '',
    address: vendor?.address || '',
    default_payment_terms_days: vendor?.default_payment_terms_days ?? 30,
    notes: vendor?.notes || '',
    is_active: vendor?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      gstin: formData.gstin || undefined,
      address: formData.address || undefined,
      default_payment_terms_days: formData.default_payment_terms_days,
      notes: formData.notes || undefined,
      is_active: formData.is_active,
    });
  };

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={vendor ? 'Edit Vendor' : 'Add New Vendor'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Vendor Name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Tech Solutions Pvt Ltd"
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="contact@vendor.com"
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+91 98765 43210"
            />
            <div className="md:col-span-2">
              <Input
                label="GSTIN"
                value={formData.gstin}
                onChange={(e) => updateField('gstin', e.target.value)}
                placeholder="29ABCDE1234F1Z5"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Address</h3>
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="123 Business Street, Mumbai, Maharashtra"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Payment Terms (days)"
              type="number"
              value={String(formData.default_payment_terms_days)}
              onChange={(e) => updateField('default_payment_terms_days', parseInt(e.target.value) || 0)}
              placeholder="30"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => updateField('is_active', e.target.value === 'active')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Additional notes about this vendor..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {vendor ? 'Update Vendor' : 'Add Vendor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
