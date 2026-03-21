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
