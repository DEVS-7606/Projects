import { z } from "zod";

const INVOICE_STATUSES = ["unpaid", "paid", "overdue", "needs_review"] as const;
const INVOICE_SOURCES = ["email", "manual", "api"] as const;

const invoiceItemSchema = z.object({
  description: z.string().default(""),
  quantity: z.number().nonnegative(),
  unit_price: z.number().nonnegative(),
  amount: z.number().nonnegative(),
});

export const createInvoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  vendor_id: z.string().uuid("Invalid vendor ID").optional(),
  invoice_date: z.string().date("Invalid invoice date").optional(),
  due_date: z.string().date("Invalid due date").optional(),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional(),
  subtotal: z.number().nonnegative().optional(),
  tax_total: z.number().nonnegative().optional(),
  total_amount: z.number().nonnegative("Total amount must be non-negative"),
  cgst_amount: z.number().nonnegative().optional(),
  sgst_amount: z.number().nonnegative().optional(),
  igst_amount: z.number().nonnegative().optional(),
  status: z.enum(INVOICE_STATUSES).optional(),
  source: z.enum(INVOICE_SOURCES).optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export const updateInvoiceSchema = z.object({
  invoice_number: z.string().min(1).optional(),
  vendor_id: z.string().uuid("Invalid vendor ID").optional(),
  invoice_date: z.string().date().optional(),
  due_date: z.string().date().optional(),
  currency: z.string().length(3).optional(),
  subtotal: z.number().nonnegative().optional(),
  tax_total: z.number().nonnegative().optional(),
  total_amount: z.number().nonnegative().optional(),
  cgst_amount: z.number().nonnegative().optional(),
  sgst_amount: z.number().nonnegative().optional(),
  igst_amount: z.number().nonnegative().optional(),
  status: z.enum(INVOICE_STATUSES).optional(),
  paid_at: z.string().datetime().optional(),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export const invoiceFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(INVOICE_STATUSES).optional(),
  source: z.enum(INVOICE_SOURCES).optional(),
  vendor_id: z.string().uuid().optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
