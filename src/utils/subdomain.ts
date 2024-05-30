export const getValidSubdomain = (host?: string | null) => {
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