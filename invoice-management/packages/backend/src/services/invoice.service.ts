import { InvoiceRepository } from "../repositories/invoice.repository.js";
import type {
  InvoiceFilters,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  PaginatedInvoices,
  DashboardStats,
} from "@invoice-management/shared";

const invoiceRepository = new InvoiceRepository();

export class InvoiceService {
  async getInvoices(
    userId: string,
    filters: InvoiceFilters,
  ): Promise<PaginatedInvoices> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const { data, total } = await invoiceRepository.findAll(userId, filters);

    return {
      invoices: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getInvoiceById(invoiceId: string, userId: string) {
    return invoiceRepository.findById(invoiceId, userId);
  }

  async createInvoice(userId: string, request: CreateInvoiceRequest) {
    return invoiceRepository.create({ ...request, user_id: userId });
  }

  async updateInvoice(
    invoiceId: string,
    userId: string,
    request: UpdateInvoiceRequest,
  ) {
    return invoiceRepository.update(invoiceId, userId, { ...request });
  }

  async deleteInvoice(invoiceId: string, userId: string) {
    return invoiceRepository.delete(invoiceId, userId);
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const invoices = await invoiceRepository.findForStats(userId);

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    const stats: DashboardStats = {
      total_invoices: invoices.length,
      unpaid_amount: 0,
      overdue_amount: 0,
      paid_this_month: 0,
      unpaid_count: 0,
      overdue_count: 0,
      paid_count: 0,
    };

    for (const inv of invoices) {
      const amount = inv.total_amount || 0;

      if (inv.status === "unpaid") {
        stats.unpaid_amount += amount;
        stats.unpaid_count++;
      } else if (inv.status === "overdue") {
        stats.overdue_amount += amount;
        stats.overdue_count++;
      } else if (inv.status === "paid") {
        stats.paid_count++;
        if (inv.paid_at && inv.paid_at >= startOfMonth) {
          stats.paid_this_month += amount;
        }
      }
    }

    return stats;
  }
}
