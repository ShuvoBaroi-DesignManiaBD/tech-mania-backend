import { z } from 'zod';

// Available payment methods
export const paymentMethodSchema = z.enum(['SSL', 'STRIPE', 'PAYPAL']);

// Payment structure validation
export const paymentInfoValidationSchema = z.object({
  method: paymentMethodSchema,
  subscriptionStatus: z.enum(['active', 'inactive']),
  subscriptionStartDate: z.date().optional(),
  subscriptionEndDate: z.date().optional(),
});

// Payment request for premium access validation
export const paymentRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  amount: z.number().positive('Amount must be a positive number'),
  method: paymentMethodSchema,
});

// Payment response after processing validation
export const paymentResponseSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  status: z.enum(['success', 'failed']),
  transactionDate: z.date(),
  amount: z.number().positive('Amount must be a positive number'),
  method: paymentMethodSchema,
});
