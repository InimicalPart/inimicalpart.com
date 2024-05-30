import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getValidSubdomain } from '@/utils/subdomain';

//! RegExp for public files  *.css, *.js, *.png, etc.
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  //! Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.startsWith('/_next')) return;

  const host = req.headers.get('host');
  const subdomain = getValidSubdomain(host);
  if (subdomain) {

    //! api.inimicalpart.com -> inimicalpart.com/api
    console.log(">>> Rewriting URL: ", url.pathname, `/${subdomain}${url.pathname}`)
    url.pathname = `/${subdomain}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}