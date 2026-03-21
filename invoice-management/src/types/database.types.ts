export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      invoices: {
        Row: {
          cgst_amount: number | null
          created_at: string
          currency: string
          due_date: string | null
          duplicate_of_invoice_id: string | null
          duplicate_status: string
          extracted_fields: Json
          file_url: string | null
          id: string
          igst_amount: number | null
          invoice_date: string | null
          invoice_number: string
          paid_at: string | null
          payment_reference: string | null
          raw_ocr_text: string | null
          sgst_amount: number | null
          source: string
          source_message_id: string | null
          status: string
          subtotal: number | null
          tax_total: number | null
          total_amount: number
          updated_at: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          cgst_amount?: number | null
          created_at?: string
          currency?: string
          due_date?: string | null
          duplicate_of_invoice_id?: string | null
          duplicate_status?: string
          extracted_fields?: Json
          file_url?: string | null
          id?: string
          igst_amount?: number | null
          invoice_date?: string | null
          invoice_number: string
          paid_at?: string | null
          payment_reference?: string | null
          raw_ocr_text?: string | null
          sgst_amount?: number | null
          source?: string
          source_message_id?: string | null
          status?: string
          subtotal?: number | null
          tax_total?: number | null
          total_amount: number
          updated_at?: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          cgst_amount?: number | null
          created_at?: string
          currency?: string
          due_date?: string | null
          duplicate_of_invoice_id?: string | null
          duplicate_status?: string
          extracted_fields?: Json
          file_url?: string | null
          id?: string
          igst_amount?: number | null
          invoice_date?: string | null
          invoice_number?: string
          paid_at?: string | null
          payment_reference?: string | null
          raw_ocr_text?: string | null
          sgst_amount?: number | null
          source?: string
          source_message_id?: string | null
          status?: string
          subtotal?: number | null
          tax_total?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
        }
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          onboarding_status: string | null
          phone_e164: string | null
          timezone: string | null
          updated_at: string
          username: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id: string
          onboarding_status?: string | null
          phone_e164?: string | null
          timezone?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          onboarding_status?: string | null
          phone_e164?: string | null
          timezone?: string | null
          updated_at?: string
          username?: string
        }
      }
      vendors: {
        Row: {
          address: string | null
          aliases: string[] | null
          created_at: string
          default_payment_terms_days: number | null
          email: string | null
          gstin: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          aliases?: string[] | null
          created_at?: string
          default_payment_terms_days?: number | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          aliases?: string[] | null
          created_at?: string
          default_payment_terms_days?: number | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
