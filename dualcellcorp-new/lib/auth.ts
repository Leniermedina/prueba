import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
type User = { id: string; email: string; name: string };
const COOKIE_NAME = 'session';
export function setSessionCookie(res: NextResponse, user: User) {
  const secret = process.env.JWT_SECRET; if (!secret) throw new Error('Missing JWT_SECRET');
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, secret, { expiresIn: '7d' });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  const jar = cookies(); const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return { user: null as null, isAdmin: false };
  try { const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = { id: payload.sub as string, email: payload.email as string, name: payload.name as string };
    const isAdmin = user.email === (process.env.ADMIN_EMAIL || '') && (cookies().get('admin')?.value === '1');
    return { user, isAdmin };
  } catch { return { user: null as null, isAdmin: false }; }
}
export async function requireAdmin() {
  const { user } = await getSession();
  if (!user) throw new Error('Unauthorized');
  const isEmail = user.email === (process.env.ADMIN_EMAIL || '');
  const isCookie = cookies().get('admin')?.value === '1';
  if (!isEmail || !isCookie) throw new Error('Forbidden');
}