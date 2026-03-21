import { apiClient } from '@/services/api-client';
import type {
  InvoiceWithVendor,
  InvoiceFilters,
  PaginatedInvoices,
  DashboardStats,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
} from '@/types';

export const invoiceApi = {
  async getAll(filters: InvoiceFilters = {}): Promise<PaginatedInvoices> {
    const params: Record<string, string> = {};

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.vendor_id) params.vendor_id = filters.vendor_id;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.page) params.page = String(filters.page);
    if (filters.limit) params.limit = String(filters.limit);

    return apiClient.get<PaginatedInvoices>('/invoices', params);
  },

  async getById(id: string): Promise<InvoiceWithVendor> {
    return apiClient.get<InvoiceWithVendor>(`/invoices/${id}`);
  },

  async create(data: CreateInvoiceRequest): Promise<InvoiceWithVendor> {
    return apiClient.post<InvoiceWithVendor>('/invoices', { ...data });
  },

  async update(id: string, data: UpdateInvoiceRequest): Promise<InvoiceWithVendor> {
    return apiClient.patch<InvoiceWithVendor>(`/invoices/${id}`, { ...data });
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  },

  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/invoices/stats');
  },
};
