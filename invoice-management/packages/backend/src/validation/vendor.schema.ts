import { z } from "zod";

export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional(),
});

export const updateVendorSchema = createVendorSchema.partial();
