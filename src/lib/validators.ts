import { z } from 'zod';
export const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
export const productSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  price: z.number().min(0),
  category: z.enum(['moviles','accesorios','covers']),
  images: z.array(z.string().url()).min(1),
  description: z.string().min(10),
  stock: z.number().int().min(0),
  featured: z.boolean().optional()
});
