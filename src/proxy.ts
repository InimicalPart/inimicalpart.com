
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const getValidSubdomain = (host?: string | null): string[] => {
  let subdomain: string | null = null;
  if (!host && typeof window !== 'undefined') {
    host = window.location.host;
  }

  let isLocalhost = host?.split('.').pop()?.includes('localhost');

  const removeLast = isLocalhost ? 1 : 2; //! Remove only the last part if localhost, otherwise remove the last two parts (domain and TLD)
  const parts = host?.split('.');

  if (parts && parts.length > removeLast) {
    //? Has a subdomain
    const subdomains = parts?.slice(0, -removeLast);

    return subdomains;
  } else {
    return ["www"];
  }
};

export async function proxy(request: NextRequest) {

  const url = request.nextUrl.clone();

  //! Skip public files
  if (url.pathname.startsWith('/_next') || url.pathname == "/favicon.ico") return;


  const host = request.headers.get('host');
  const subdomain = getValidSubdomain(host);
  if (subdomain.length) {
    url.pathname = `/${subdomain.toReversed().join('/')}${url.pathname}`; // test.forward.inimi.dev -> /forward/test
  }




  return NextResponse.rewrite(url);
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [
      "/((?!ws/|clerk_).*)",
  ]
}