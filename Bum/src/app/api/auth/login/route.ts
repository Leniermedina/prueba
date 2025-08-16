import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';
import { credentialsSchema } from '@/lib/validators';
import { createSession } from '@/lib/auth';
import { getEnv } from '@/lib/env';
export const runtime = 'nodejs';
export async function POST(req: NextRequest){
  const body = await req.json();
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const { email, password } = parsed.data;
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = getEnv();
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    await createSession({ userId: 'admin', email, role: 'admin' }); return NextResponse.json({ ok: true });
  }
  const user = await kv.hgetall<any>(`user:${email}`);
  if (!user?.passwordHash) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  await createSession({ userId: user.id, email, role: 'user' }); return NextResponse.json({ ok: true });
}
