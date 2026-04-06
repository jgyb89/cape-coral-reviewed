import { NextResponse } from 'next/server';

/**
 * Next.js Edge Logic (proxy.js)
 * Consolidated handling for:
 * 1. Rate Limiting (IP-based)
 * 2. Route Protection (Dashboard & Submit Listing)
 * 3. Security Headers
 */

// Basic in-memory rate limiter for Edge Functions
const rateLimitMap = new Map();

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';

  // --- 1. RATE LIMITING LOGIC ---
  const sensitivePaths = [
    '/login',
    '/register-business',
    '/register',
    '/api/auth',
  ];

  const isSensitive = sensitivePaths.some((path) => pathname.startsWith(path));

  if (isSensitive) {
    const limit = 10; // Max requests per minute
    const windowMs = 60 * 1000;
    const now = Date.now();
    const userUsage = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userUsage.lastReset > windowMs) {
      userUsage.count = 1;
      userUsage.lastReset = now;
    } else {
      userUsage.count++;
    }

    rateLimitMap.set(ip, userUsage);

    if (userUsage.count > limit) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        statusText: 'Too Many Requests',
        headers: {
          'Content-Type': 'text/plain',
          'Retry-After': '60',
        },
      });
    }
  }

  // --- 2. ROUTE PROTECTION LOGIC ---
  if (pathname.startsWith('/dashboard')) {
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/submit-listing')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/register-business', request.url));
    }
  }

  // --- 3. SUCCESS & SECURITY HEADERS ---
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Export as 'proxy' to satisfy specific framework conventions if necessary
export const proxy = middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
