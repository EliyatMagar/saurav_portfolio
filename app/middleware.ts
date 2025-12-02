// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Protect auth routes if already logged in
  if (request.nextUrl.pathname.startsWith('/auth/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Protect dashboard routes if not logged in
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login'],
};