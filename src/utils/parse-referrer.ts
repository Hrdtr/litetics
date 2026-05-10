import { referrers } from '../data/referrers';

export interface ParsedReferrer {
  referrerHost: string;
  referrerPath: string;
  referrerQueryString: string | null;
  referrerKnown: boolean;
  referrerMedium: string | null;
  referrerName: string | null;
  referrerSearchParameter: string | null;
  referrerSearchTerm: string | null;
}

export const parseReferrer = (referrerURL: string, currentURL?: string): ParsedReferrer => {
  const url = new URL(referrerURL);
  const referrer: ParsedReferrer = {
    referrerHost: url.host,
    referrerPath: url.pathname,
    referrerQueryString: url.searchParams.toString() || null,
    referrerKnown: false,
    referrerMedium: null,
    referrerName: null,
    referrerSearchParameter: null,
    referrerSearchTerm: null,
  };

  if (currentURL) {
    const currURL = new URL(currentURL);
    const currHostname = currURL.hostname;

    if (currHostname === url.hostname) {
      referrer.referrerKnown = true;
      referrer.referrerMedium = 'internal';
      return referrer;
    }
  }

  let foundReferrer = lookupReferrer(url.hostname, true);
  if (!foundReferrer) {
    foundReferrer = lookupReferrer(url.hostname, false);
    if (!foundReferrer) return referrer;
  }

  referrer.referrerKnown = true;
  referrer.referrerName = foundReferrer.name;
  referrer.referrerMedium = foundReferrer.medium;

  if (foundReferrer.medium === 'search' && foundReferrer.parameters) {
    const params = foundReferrer.parameters;
    url.searchParams.forEach((val, param) => {
      if (params.includes(param.toLowerCase())) {
        if (!referrer.referrerSearchParameter) {
          referrer.referrerSearchParameter = param;
          referrer.referrerSearchTerm = val;
        }
      }
    });
  }

  return referrer;
};

interface LookupReferrerResult {
  name: string;
  medium: string;
  parameters?: string[];
}

function lookupReferrer(hostname: string, exact: boolean): LookupReferrerResult | null {
  for (const [mediumName, referrersByMedium] of Object.entries(referrers)) {
    for (const [referrerName, referrer] of Object.entries(referrersByMedium)) {
      if (
        referrer.domains.some((domain) =>
          exact ? hostname === domain : hostname === domain || hostname.endsWith('.' + domain),
        )
      ) {
        const { parameters } = referrer;
        return {
          name: referrerName,
          medium: mediumName,
          parameters,
        };
      }
    }
  }
  return null;
}
