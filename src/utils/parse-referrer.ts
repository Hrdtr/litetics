import { referrers } from "../data/referrers";

interface Referrer {
  host: string;
  path: string
  queryString: string | null
  known: boolean;
  medium: string;
  name: string | null;
  searchParameter: string | null;
  searchTerm: string | null;
  _src: string;
}

export const parseReferrer = (referrerURL: string, currentURL?: string): Referrer => {
  const url = new URL(referrerURL);
  const referrer: Referrer = {
    host: url.host,
    path: url.pathname,
    queryString: url.searchParams.toString() || null,
    known: false,
    medium: 'unknown',
    name: null,
    searchParameter: null,
    searchTerm: null,
    _src: referrerURL,
  }

  if (currentURL) {
    const currURL = new URL(currentURL);
    const currHostname = currURL.hostname;

    if (currHostname === url.hostname) {
      referrer.medium = 'internal';
      return referrer;
    }
  }

  let foundReferrer = lookupReferrer(url.hostname, true);
  if (!foundReferrer) {
    foundReferrer = lookupReferrer(url.hostname, false);
    if (!foundReferrer) return referrer
  }

  referrer.known = true;
  referrer.name = foundReferrer.name;
  referrer.medium = foundReferrer.medium;

  if (foundReferrer.medium === 'search' && foundReferrer.parameters) {
    const pqs = Object.fromEntries(url.searchParams);
    for (const param in pqs) {
      const val = pqs[param];
      if (foundReferrer.parameters.includes(param.toLowerCase())) {
        referrer.searchParameter = param;
        referrer.searchTerm = val;
      }
    }
  }

  return referrer
}

function lookupReferrer(hostname: string, exact: boolean) {
  for (const medium in referrers) {
    for (const name in referrers[medium]) {
      const referrer = referrers[medium][name];
      if (referrer.domains.some(domain => exact ? hostname === domain : hostname.endsWith(domain))) {
        const { parameters } = referrer
        return {
          name,
          medium,
          parameters
        };
      }
    }
  }
  return null;
}
