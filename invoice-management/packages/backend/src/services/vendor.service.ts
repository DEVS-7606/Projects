import { VendorRepository } from '../repositories/vendor.repository.js';
import type { CreateVendorRequest, UpdateVendorRequest } from '@invoice-management/shared';

const vendorRepository = new VendorRepository();

export class VendorService {
  async getVendors(userId: string) {
    return vendorRepository.findAll(userId);
  }

  async getVendorById(vendorId: string, userId: string) {
    return vendorRepository.findById(vendorId, userId);
  }

  async createVendor(userId: string, request: CreateVendorRequest) {
    return vendorRepository.create({
      ...request,
      user_id: userId,
    });
  }

  async updateVendor(vendorId: string, userId: string, request: UpdateVendorRequest) {
    return vendorRepository.update(vendorId, userId, { ...request });
  }

  async deleteVendor(vendorId: string, userId: string) {
    return vendorRepository.delete(vendorId, userId);
  }
}
