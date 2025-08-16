import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
const PROTECTED = ['/', '/home', '/products', '/product', '/cart', '/about', '/admin'];
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const needsAuth = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!needsAuth) return NextResponse.next();
  const token = req.cookies.get('session')?.value;
  if (!token) {
    const login = new URL('/login', req.url); login.searchParams.set('redirect', pathname); return NextResponse.redirect(login);
  }
  if (pathname.startsWith('/admin')) {
    try { const secret = new TextEncoder().encode(process.env.AUTH_SECRET!); const { payload } = await jwtVerify(token, secret); if ((payload as any).role !== 'admin') return NextResponse.redirect(new URL('/', req.url)); }
    catch { return NextResponse.redirect(new URL('/login', req.url)); }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest|sitemap.xml).*)'] };
