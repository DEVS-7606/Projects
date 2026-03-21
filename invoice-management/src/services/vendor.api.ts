import { apiClient } from '@/services/api-client';
import type { Vendor, CreateVendorRequest, UpdateVendorRequest } from '@/types';

export const vendorApi = {
  async getAll(): Promise<Vendor[]> {
    return apiClient.get<Vendor[]>('/vendors');
  },

  async getById(id: string): Promise<Vendor> {
    return apiClient.get<Vendor>(`/vendors/${id}`);
  },

  async create(data: CreateVendorRequest): Promise<Vendor> {
    return apiClient.post<Vendor>('/vendors', { ...data });
  },

  async update(id: string, data: UpdateVendorRequest): Promise<Vendor> {
    return apiClient.patch<Vendor>(`/vendors/${id}`, { ...data });
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/vendors/${id}`);
  },
};
