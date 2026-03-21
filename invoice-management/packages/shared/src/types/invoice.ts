import type { Vendor } from "./vendor";

export type InvoiceStatus = "unpaid" | "paid" | "overdue" | "needs_review";
export type InvoiceSource = "email" | "manual" | "api";
export type DuplicateStatus = "suspected" | "confirmed" | "ignored" | null;

export interface Invoice {
  id: string;
  user_id: string;
  vendor_id: string | null;
  invoice_number: string;
  invoice_date: string | null;
  due_date: string | null;
  currency: string;
  subtotal: number | null;
  tax_total: number | null;
  total_amount: number;
  cgst_amount: number | null;
  sgst_amount: number | null;
  igst_amount: number | null;
  status: InvoiceStatus;
  paid_at: string | null;
  payment_reference: string | null;
  source: InvoiceSource;
  source_message_id: string | null;
  file_url: string | null;
  raw_ocr_text: string | null;
  extracted_fields: Record<string, unknown>;
  duplicate_status: string;
  duplicate_of_invoice_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithVendor extends Invoice {
  vendor: Vendor | null;
}

export interface CreateInvoiceRequest {
  invoice_number: string;
  vendor_id?: string;
  invoice_date?: string;
  due_date?: string;
  currency?: string;
  subtotal?: number;
  tax_total?: number;
  total_amount: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  status?: InvoiceStatus;
  source?: InvoiceSource;
}

export interface UpdateInvoiceRequest {
  invoice_number?: string;
  vendor_id?: string;
  invoice_date?: string;
  due_date?: string;
  currency?: string;
  subtotal?: number;
  tax_total?: number;
  total_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  status?: InvoiceStatus;
  paid_at?: string;
  payment_reference?: string;
}

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus;
  source?: InvoiceSource;
  vendor_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedInvoices {
  invoices: InvoiceWithVendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  total_invoices: number;
  unpaid_amount: number;
  overdue_amount: number;
  paid_this_month: number;
  unpaid_count: number;
  overdue_count: number;
  paid_count: number;
}
