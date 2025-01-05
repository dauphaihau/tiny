import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must include at least one number' }),
});

export const loginSchema = z.object({
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
});

export const forgotPasswordSchema = z.object({
  email: registerSchema.shape.email,
});

export const resetPasswordSchema = z.object({
  password: registerSchema.shape.password,
  confirmPassword: registerSchema.shape.password,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
