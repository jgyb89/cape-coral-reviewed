import { NextResponse } from 'next/server';

/**
 * Next.js Middleware - Consolidated Edge Logic
 * Handles Rate Limiting (placeholder), Dashboard Authentication, and Security Headers.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;

  // 1. Run the existing rate-limiting logic first
  // (Note: Currently a placeholder as per the original proxy.js)
  // if (!checkRateLimit(request)) {
  //   return new NextResponse('Too Many Requests', { status: 429 });
  // }

  // 2. If the request passes the rate limit, check for dashboard protection
  if (pathname.startsWith('/dashboard')) {
    // 3. Check for the presence of the authToken HTTPOnly cookie
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      // Preserving the original destination as a redirect parameter
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. If everything passes, return NextResponse.next() with security headers
  const response = NextResponse.next();

  // Basic security headers from original proxy.js
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Export as 'proxy' as well if the environment specifically looks for this name
export const proxy = middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * 
     * This includes:
     * - /api/:path* (Rate-limited API routes)
     * - /dashboard/:path* (Protected dashboard routes)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
