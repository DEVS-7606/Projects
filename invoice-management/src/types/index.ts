// ─── Auth ────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  business_name: string;
  email: string;
  forwarding_email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionResponse {
  user: User | null;
  authenticated: boolean;
}

// ─── Vendor ──────────────────────────────────────────────────────
export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  gstin: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  aliases: string[] | null;
  default_payment_terms_days: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorRequest {
  name: string;
  gstin?: string;
  email?: string;
  phone?: string;
  address?: string;
  aliases?: string[];
  default_payment_terms_days?: number;
  notes?: string;
  is_active?: boolean;
}

export interface UpdateVendorRequest {
  name?: string;
  gstin?: string;
  email?: string;
  phone?: string;
  address?: string;
  aliases?: string[];
  default_payment_terms_days?: number;
  notes?: string;
  is_active?: boolean;
}

// ─── Invoice ─────────────────────────────────────────────────────
export type InvoiceStatus = "unpaid" | "paid" | "overdue" | "needs_review";
export type InvoiceSource = "email" | "manual" | "api";

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
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithVendor extends Invoice {
  vendor: Vendor | null;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
  updated_at: string;
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
  notes?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
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

// ─── Dashboard ───────────────────────────────────────────────────
export interface DashboardStats {
  total_invoices: number;
  unpaid_amount: number;
  overdue_amount: number;
  paid_this_month: number;
  unpaid_count: number;
  overdue_count: number;
  paid_count: number;
}
