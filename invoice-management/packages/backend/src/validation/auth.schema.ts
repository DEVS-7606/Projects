import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  business_name: z.string().optional(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .optional(),
});
