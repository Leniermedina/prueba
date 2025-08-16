import { NextRequest, NextResponse } from 'next/server';
const PUBLIC_PATHS = [/^\/login(?:\/)?$/i,/^\/api\/auth\/(login|register|logout|admin-login)$/i,/^\/api\/session$/i,/^\/_next\//,/^\/favicon\.ico$/,/^\/locales\//,/^\/public\//,/^\/img\//,/^\/logo\.svg$/];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((r) => r.test(pathname));
  const session = req.cookies.get('session')?.value;
  if (pathname === '/') return NextResponse.redirect(new URL(session?'/home':'/login', req.url));
  if (pathname.startsWith('/admin') && !session) { const url=new URL('/login', req.url); url.searchParams.set('redirect','/admin'); return NextResponse.redirect(url); }
  const protectedPrefixes = ['/home','/productos','/carrito','/acerca-de'];
  const isProtected = protectedPrefixes.some((p)=>pathname.startsWith(p));
  if (isPublic || !isProtected) return NextResponse.next();
  if (!session) { const url=new URL('/login', req.url); url.searchParams.set('redirect', pathname); return NextResponse.redirect(url); }
  return NextResponse.next();
}
export const config = { matcher: ['/', '/login','/home/:path*','/productos/:path*','/carrito/:path*','/acerca-de/:path*','/admin/:path*','/api/:path*'] };