import { referrers } from "../data/referrers";

interface Referrer {
  known: boolean;
  name: string | null;
  medium: string;
  searchParameter: string | null;
  searchTerm: string | null;
  url: URL;
  _src: string;
}

export const parseReferrer = (referrerURL: string, currentURL?: string): Referrer => {
  const referrer: Referrer = {
    known: false,
    name: null,
    medium: 'unknown',
    searchParameter: null,
    searchTerm: null,
    url: new URL(referrerURL),
    _src: referrerURL,
  }
  const hostname = referrer.url.hostname

  const known = Boolean(~['http:', 'https:'].indexOf(referrer.url.protocol || ''));
  if (!known) return referrer
  
  referrer.known = known

  if (currentURL) {
    const currURL = new URL(currentURL);
    const currHostname = currURL.hostname;

    if (currHostname === hostname) {
      referrer.medium = 'internal';
      return referrer;
    }
  }

  let foundReferrer = lookupReferrer(hostname, true);
  if (!foundReferrer) {
    foundReferrer = lookupReferrer(hostname, false);
    if (!foundReferrer) return referrer
  }

  referrer.name = foundReferrer.name;
  referrer.medium = foundReferrer.medium;

  if (foundReferrer.medium === 'search' && foundReferrer.parameters) {
    const pqs = Object.fromEntries(referrer.url.searchParams);
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
