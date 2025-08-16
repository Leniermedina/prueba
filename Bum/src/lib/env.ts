import { z } from 'zod';
const envSchema = z.object({
  AUTH_SECRET: z.string().min(32),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  KV_REST_API_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(10),
  BLOB_READ_WRITE_TOKEN: z.string().min(10),
  NEXT_PUBLIC_WHATSAPP_PHONE: z.string().startsWith('+'),
  SENTRY_DSN: z.string().optional().nullable()
});
export type Env = z.infer<typeof envSchema>;
let _env: Env | null = null;
export function getEnv(): Env {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) { console.error(parsed.error.flatten().fieldErrors); throw new Error('ENV inválidas.'); }
  _env = parsed.data; return _env;
}
