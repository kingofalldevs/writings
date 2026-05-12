import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';
  
  // Define your root domain (change this if your production domain is different)
  const rootDomain = 'writings.page';
  
  // Skip if we are on localhost or the root domain exactly
  if (host === rootDomain || host === 'localhost:3000' || host === 'www.' + rootDomain) {
    return NextResponse.next();
  }

  // Extract subdomain
  // Example: john.writings.page -> john
  const subdomain = host.replace(`.${rootDomain}`, '').replace(':3000', '');

  // If there's a subdomain
  if (subdomain && subdomain !== 'www') {
    // Only rewrite the root of the subdomain to the author profile
    if (url.pathname === '/' || url.pathname === '') {
      return NextResponse.rewrite(new URL(`/author/${subdomain}`, req.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on relevant paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_fonts|[\\w-]+\\.\\w+).*)',
  ],
};
