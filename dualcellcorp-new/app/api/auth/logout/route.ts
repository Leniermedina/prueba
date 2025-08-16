import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', '', { path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 0 });
  res.cookies.set('admin', '', { path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 0 });
  return res;
}