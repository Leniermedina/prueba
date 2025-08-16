import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@lib/auth';
export const runtime = 'nodejs';
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8), redirect: z.string().optional() });
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'invalid_credentials' }, { status: 401 });
  const { email, password, redirect } = parsed.data;
  const user = await kv.hgetall<Record<string, string>>(`user:email:${email}`);
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ code: 'invalid_credentials' }, { status: 401 });
  const res = NextResponse.json({ ok: true, redirect: redirect || '/home' });
  setSessionCookie(res, { id: user.id, email: user.email, name: user.name });
  return res;
}