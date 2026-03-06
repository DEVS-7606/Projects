// Auth
export interface User {
  id: string;
  username: string;
  business_name: string;
  email: string;
  forwarding_email: string;
}

// Vendor
export interface Vendor {
  id: string;
  name: string;
  gstin?: string;
  email?: string;
  phone?: string;
  address?: string;
  default_payment_terms_days?: number;
  notes?: string;
  aliases?: string[];
  is_active: boolean;
}

// Invoice
export interface Invoice {
  id: string;
  vendor_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_total: number;
  total_amount: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'needs_review';
  paid_at?: string;
  payment_reference?: string;
  source: 'email' | 'manual' | 'api';
  source_message_id?: string;
  file_url?: string;
  raw_ocr_text?: string;
  extracted_fields?: Record<string, any>;
  duplicate_status?: 'suspected' | 'confirmed' | 'ignored' | null;
  duplicate_of_invoice_id?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_invoices: number;
  unpaid_amount: number;
  overdue_amount: number;
  paid_this_month: number;
}

// Filter options
export interface InvoiceFilters {
  search?: string;
  status?: Invoice['status'];
  source?: Invoice['source'];
  vendor_id?: string;
  date_from?: string;
  date_to?: string;
}
