import { NextResponse } from 'next/server';

export function proxy(req) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';
  
  // Define your root domain (change this if your production domain is different)
  const rootDomain = 'writings.page';
  
  // Skip if we are on localhost or the root domain exactly
  if (host === rootDomain || host === 'localhost:3000' || host === 'www.' + rootDomain) {
    return NextResponse.next();
  }

  // Extract subdomain
  const hostname = host.split(':')[0]; // Remove port if present
  
  let subdomain = '';
  if (hostname.endsWith('.localhost')) {
    subdomain = hostname.replace('.localhost', '');
  } else if (hostname.endsWith('.' + rootDomain)) {
    subdomain = hostname.replace('.' + rootDomain, '');
  }

  if (subdomain && !['www', 'app', 'dev', 'api', 'admin'].includes(subdomain)) {
    // Rewrite to /author/[subdomain]/...
    // If the internal path starts with /author already, don't double it
    if (url.pathname.startsWith('/author')) {
      return NextResponse.next();
    }
    
    const authorPath = `/author/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    console.log(`Subdomain rewrite: ${host}${url.pathname} -> ${authorPath}`);
    return NextResponse.rewrite(new URL(authorPath, req.url));
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
