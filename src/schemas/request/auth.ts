import { z } from 'zod';
import { authSchema } from '@/schemas/models/auth';
import { profileSchema } from '@/schemas/models/profile';

export const registerSchema = z.object({
  name: profileSchema.shape.first_name,
  email: authSchema.shape.email,
  password: authSchema.shape.password,
});

export const loginSchema = z.object({
  email: authSchema.shape.email,
  password: authSchema.shape.password,
});

export const forgotPasswordSchema = z.object({
  email: authSchema.shape.email,
});

export const resetPasswordSchema = z.object({
  password: authSchema.shape.password,
  confirmPassword: authSchema.shape.password,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
