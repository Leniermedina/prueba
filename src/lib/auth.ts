import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from './env';
type Session = { userId: string; email: string; role: 'admin' | 'user' };
const COOKIE = 'session';
export async function createSession(payload: Session) {
  const { AUTH_SECRET } = getEnv();
  const token = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(new TextEncoder().encode(AUTH_SECRET));
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60*60*24*7 });
}
export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(COOKIE)?.value; if (!cookie) return null;
  try { const { AUTH_SECRET } = getEnv(); const { payload } = await jwtVerify(cookie, new TextEncoder().encode(AUTH_SECRET)); return payload as Session; } catch { return null; }
}
export async function destroySession(){ (await cookies()).set(COOKIE, '', { httpOnly:true, secure:true, sameSite:'lax', path:'/', maxAge:0 }); }
