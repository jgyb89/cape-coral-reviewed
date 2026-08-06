import { BASE_URL } from "@/lib/constants";

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/login', '/register', '/register-business', '/submit-listing', '/check-email', '/mobile-opt-in', '/submission-success'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
