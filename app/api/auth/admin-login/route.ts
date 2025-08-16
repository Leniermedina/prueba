import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@lib/auth';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(()=> ({}));
  const pass: string = body?.password || '';
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (user.email === adminEmail && pass === adminPassword) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin', '1', { path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60*60*8 });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 403 });
}