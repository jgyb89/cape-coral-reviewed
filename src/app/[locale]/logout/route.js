import { logoutUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. Clear the auth cookie
  await logoutUser();

  // 2. Determine redirect destination based on where the user clicked "Logout"
  const referer = request.headers.get('referer');
  let redirectUrl = new URL('/en', request.url); // Default fallback

  if (referer) {
    const refererUrl = new URL(referer);
    const pathname = refererUrl.pathname;

    // Extract the locale from the path (assuming /[locale]/...)
    const segments = pathname.split('/').filter(Boolean);
    const locale = segments[0] && ['en', 'es'].includes(segments[0]) ? segments[0] : 'en';

    // Check if user was inside the dashboard
    if (pathname.includes('/dashboard')) {
      // Send to the localized homepage
      redirectUrl = new URL(`/${locale}`, request.url);
    } else {
      // Send them right back to the exact page they were viewing
      redirectUrl = new URL(refererUrl.pathname + refererUrl.search, request.url);
    }
  }

  // 3. Create the redirect response
  const response = NextResponse.redirect(redirectUrl);

  // 4. CRITICAL: Force browsers and Next.js NOT to cache this logout request
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  return response;
}
