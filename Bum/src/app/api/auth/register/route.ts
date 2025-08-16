import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';
import { credentialsSchema } from '@/lib/validators';
export const runtime = 'nodejs';
export async function POST(req: NextRequest){
  const body = await req.json();
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const { email, password } = parsed.data;
  const exists = await kv.exists(`user:${email}`);
  if (exists) return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 });
  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  await kv.hset(`user:${email}`, { id, email, passwordHash });
  await kv.set(`user:id:${id}`, email);
  return NextResponse.json({ ok: true });
}
