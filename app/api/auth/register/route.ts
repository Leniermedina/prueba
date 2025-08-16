import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@lib/auth';
import { userSchema } from '@lib/validators';
export const runtime = 'nodejs';
const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8), redirect: z.string().optional() });
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'password_length' }, { status: 400 });
  const { name, email, password, redirect } = parsed.data;
  const exists = await kv.exists(`user:email:${email}`);
  if (exists) return NextResponse.json({ code: 'invalid_credentials' }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const user = userSchema.parse({ id, email, name, passwordHash, createdAt: Date.now() });
  await kv.hset(`user:email:${email}`, user);
  await kv.hset(`user:id:${id}`, user);
  const res = NextResponse.json({ ok: true, redirect: redirect || '/home' });
  setSessionCookie(res, { id, email, name });
  return res;
}