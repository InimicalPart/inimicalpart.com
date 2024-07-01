import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  if (!host && typeof window !== 'undefined') {
    host = window.location.host;
  }
  if (host && host.includes('.')) {
    const candidate = host.split('.')[0];
    if (candidate && !candidate.includes('localhost')) {
      subdomain = candidate;
    }
  }

  //! Return subdomain or null if localhost, but if there is no subdomain, return "www"
  return subdomain || ((host as string).split('.')[0].includes('localhost') ? null : "www");
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  //! Skip public files
  if (url.pathname.startsWith('/_next') || url.pathname == "/favicon.ico") return;


  const host = req.headers.get('host');
  const subdomain = getValidSubdomain(host);
  if (subdomain) {

    //! api.inimicalpart.com -> inimicalpart.com/api
    //!     inimicalpart.com -> inimicalpart.com/www
    url.pathname = `/${subdomain}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}