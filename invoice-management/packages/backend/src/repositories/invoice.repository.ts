import { supabase } from "../config/supabase.js";
import type { InvoiceFilters } from "@invoice-management/shared";

export class InvoiceRepository {
  async findAll(userId: string, filters: InvoiceFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("invoices")
      .select("*, vendor:vendors(*)", { count: "exact" })
      .eq("user_id", userId);

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.source) query = query.eq("source", filters.source);
    if (filters.vendor_id) query = query.eq("vendor_id", filters.vendor_id);
    if (filters.search) {
      query = query.or(
        `invoice_number.ilike.%${filters.search}%,vendor.name.ilike.%${filters.search}%`,
      );
    }
    if (filters.date_from) query = query.gte("invoice_date", filters.date_from);
    if (filters.date_to) query = query.lte("invoice_date", filters.date_to);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return { data: data || [], total: count || 0 };
  }

  async findById(invoiceId: string, userId: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, vendor:vendors(*)")
      .eq("id", invoiceId)
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async create(invoiceData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from("invoices")
      .insert(invoiceData)
      .select("*, vendor:vendors(*)")
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async update(
    invoiceId: string,
    userId: string,
    updates: Record<string, unknown>,
  ) {
    const { data, error } = await supabase
      .from("invoices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", invoiceId)
      .eq("user_id", userId)
      .select("*, vendor:vendors(*)")
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async delete(invoiceId: string, userId: string) {
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  }

  /** Returns raw invoice rows needed for stats calculation — no business logic here */
  async findForStats(userId: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select("status, total_amount, paid_at")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return data || [];
  }
}
