import { z } from 'zod';
export const userSchema = z.object({ id: z.string().uuid(), email: z.string().email(), name: z.string().min(1), passwordHash: z.string().min(10), createdAt: z.number() });
export const productSchema = z.object({ id: z.string().uuid(), name: z.string().min(1), price: z.number().min(0), category: z.enum(['moviles','covers','accesorios']), imageUrl: z.string().url().optional(), createdAt: z.number(), updatedAt: z.number() });
