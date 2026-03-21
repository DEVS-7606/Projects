import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/atoms/Modal";
import { Button } from "@/shared/components/atoms/Button";
import { useVendors } from "@/hooks/useVendors";
import { invoiceApi } from "@/services/invoice.api";
import type { CreateInvoiceRequest } from "@/types";

interface AddInvoiceModalProps {
  onClose: () => void;
  onSave: () => void;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export function AddInvoiceModal({ onClose, onSave }: AddInvoiceModalProps) {
  const { vendors } = useVendors();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    vendorId: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "INR",
    taxType: "cgst_sgst",
    notes: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, amount: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.amount = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      }),
    );
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.18; // 18% total (9% CGST + 9% SGST or 18% IGST)
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const cgst = formData.taxType === "cgst_sgst" ? taxAmount / 2 : 0;
  const sgst = formData.taxType === "cgst_sgst" ? taxAmount / 2 : 0;
  const igst = formData.taxType === "igst" ? taxAmount : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const request: CreateInvoiceRequest = {
        invoice_number: formData.invoiceNumber,
        vendor_id: formData.vendorId || undefined,
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate || undefined,
        total_amount: total,
        subtotal: subtotal,
        tax_total: taxAmount,
        cgst_amount: cgst || undefined,
        sgst_amount: sgst || undefined,
        igst_amount: igst || undefined,
        currency: formData.currency,
        status: "unpaid",
        source: "manual",
      };

      await invoiceApi.create(request);
      onSave();
    } catch (err) {
      console.error("Failed to create invoice:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Add New Invoice" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Invoice Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                placeholder="INV-001"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vendor *
              </label>
              <select
                value={formData.vendorId}
                onChange={(e) =>
                  setFormData({ ...formData, vendorId: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                required
              >
                <option value="">Select Vendor</option>
                {vendors
                  .filter((v) => v.is_active)
                  .map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Invoice Date *
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceDate: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tax Type
              </label>
              <select
                value={formData.taxType}
                onChange={(e) =>
                  setFormData({ ...formData, taxType: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              >
                <option value="cgst_sgst">CGST + SGST (9% + 9%)</option>
                <option value="igst">IGST (18%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#3b82f6] hover:bg-[#3b82f6]/5 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="Item description"
                      className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseFloat(e.target.value),
                        )
                      }
                      placeholder="Qty"
                      min="1"
                      step="1"
                      className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "unitPrice",
                          parseFloat(e.target.value),
                        )
                      }
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={`₹${item.amount.toFixed(2)}`}
                      readOnly
                      className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-gray-400 hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            {formData.taxType === "cgst_sgst" ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{cgst.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{sgst.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">IGST (18%)</span>
                <span className="font-medium text-gray-900">
                  ₹{igst.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-[#e5e7eb]">
              <span className="text-gray-600">Total Tax</span>
              <span className="font-medium text-gray-900">
                ₹{taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t-2 border-[#e5e7eb]">
              <span className="text-base font-semibold text-gray-900">
                Total Amount
              </span>
              <span className="text-xl font-bold text-[#3b82f6]">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Additional notes or comments..."
            rows={3}
            className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
