import type { InvoiceFilters } from "@invoice-management/shared";
import { supabase } from "../config/supabase.js";

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
      // PostgREST doesn't support filtering on embedded relations in .or(),
      // so we resolve matching vendor IDs first, then combine with invoice_number search.
      const { data: matchingVendors } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", userId)
        .ilike("name", `%${filters.search}%`);

      const vendorIds = (matchingVendors || []).map((v) => v.id);

      if (vendorIds.length > 0) {
        query = query.or(
          `invoice_number.ilike.%${filters.search}%,vendor_id.in.(${vendorIds.join(",")})`,
        );
      } else {
        query = query.ilike("invoice_number", `%${filters.search}%`);
      }
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
      .select("*, vendor:vendors(*), items:invoice_items(*)")
      .eq("id", invoiceId)
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async create(invoiceData: Record<string, unknown>) {
    const { items, ...invoiceFields } = invoiceData as Record<
      string,
      unknown
    > & {
      items?: Array<{
        description: string;
        quantity: number;
        unit_price: number;
        amount: number;
      }>;
    };

    const { data, error } = await supabase
      .from("invoices")
      .insert(invoiceFields)
      .select("*, vendor:vendors(*)")
      .single();

    if (error) throw new Error(error.message);

    if (items && items.length > 0) {
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(items.map((item) => ({ ...item, invoice_id: data.id })));
      if (itemsError) throw new Error(itemsError.message);
    }

    // re-fetch with items included
    return this.findById(data.id, invoiceFields.user_id as string);
  }

  async update(
    invoiceId: string,
    userId: string,
    updates: Record<string, unknown>,
  ) {
    const { items, ...invoiceFields } = updates as Record<string, unknown> & {
      items?: Array<{
        description: string;
        quantity: number;
        unit_price: number;
        amount: number;
      }>;
    };

    const { error } = await supabase
      .from("invoices")
      .update({ ...invoiceFields, updated_at: new Date().toISOString() })
      .eq("id", invoiceId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    if (items) {
      // replace all items
      await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);
      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(items.map((item) => ({ ...item, invoice_id: invoiceId })));
        if (itemsError) throw new Error(itemsError.message);
      }
    }

    return this.findById(invoiceId, userId);
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
