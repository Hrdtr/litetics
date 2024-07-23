import { referrers } from "../data/referrers";

/**
 * Object representing a parsed referrer.
 */
export interface ParsedReferrer {
  /**
   * The host of the referrer.
   */
  host: string;

  /**
   * The path of the referrer.
   */
  path: string;

  /**
   * The query string of the referrer, or null if there is no query string.
   */
  queryString: string | null;

  /**
   * Whether the referrer is known.
   */
  known: boolean;

  /**
   * The medium of the referrer, or null if the referrer is unknown.
   */
  medium: string | null;

  /**
   * The name of the referrer, or null if the referrer is unknown.
   */
  name: string | null;

  /**
   * The known search parameter of the referrer, or null if there is no known search parameter found.
   */
  searchParameter: string | null;

  /**
   * The search term of the referrer, or null if there is no search term.
   */
  searchTerm: string | null;

  /**
   * The original referrer URL.
   */
  _src: string;
}

/**
 * Parses a referrer URL and returns information about the referrer.
 *
 * @param {string} referrerURL - The URL of the referrer.
 * @param {string} [currentURL] - The current URL.
 * @return {ParsedReferrer} An object containing information about the referrer.
 */
export const parseReferrer = (referrerURL: string, currentURL?: string): ParsedReferrer => {
  const url = new URL(referrerURL);
  const referrer: ParsedReferrer = {
    host: url.host,
    path: url.pathname,
    queryString: url.searchParams.toString() || null, // Convert search params to string; null if empty.
    known: false, // Initially, assume the referrer is unknown.
    medium: null,
    name: null,
    searchParameter: null,
    searchTerm: null,
    _src: referrerURL, // Store the original referrer URL.
  }

  // Check if currentURL is provided to determine if the referrer is internal.
  if (currentURL) {
    const currURL = new URL(currentURL);
    const currHostname = currURL.hostname;

    // If the hostname of the current URL matches the referrer's, it's an internal referrer.
    if (currHostname === url.hostname) {
      referrer.known = true
      referrer.medium = 'internal';
      return referrer;
    }
  }

  // Attempt to find a known referrer match with strict matching first.
  let foundReferrer = lookupReferrer(url.hostname, true);
  if (!foundReferrer) {
    // If no strict match is found, try non-strict matching.
    foundReferrer = lookupReferrer(url.hostname, false);
    if (!foundReferrer) return referrer; // Return if no referrer is found.
  }

  // Update referrer details based on the found referrer information.
  referrer.known = true;
  referrer.name = foundReferrer.name;
  referrer.medium = foundReferrer.medium;

  // Special handling for search referrers to extract search parameters and terms.
  if (foundReferrer.medium === 'search' && foundReferrer.parameters) {
    const pqs = Object.fromEntries(url.searchParams); // Convert URLSearchParams to a plain object.
    for (const param in pqs) {
      const val = pqs[param];
      // Check if the parameter is in the list of known search parameters.
      if (foundReferrer.parameters.includes(param.toLowerCase())) {
        referrer.searchParameter = param;
        referrer.searchTerm = val; // Assign the search term.
      }
    }
  }

  return referrer;
}

interface LookupReferrerResult {
  /**
   * The name of the referrer source.
   */
  name: string;
  
  /**
   * The medium type of the referrer such as 'search', 'social', etc.
   */
  medium: string;
  
  /**
   * A list of parameters used for identifying the referrer, or undefined if not applicable.
   */
  parameters?: string[];
}
/**
 * Searches for a referrer in the `referrers` object based on the given hostname.
 *
 * @param {string} hostname - The hostname to search for.
 * @param {boolean} exact - Whether the search should be exact or not.
 * @return {LookupReferrerResult | null} An object containing the name, medium, and parameters of the found referrer, or null if not found.
 */
function lookupReferrer(hostname: string, exact: boolean): LookupReferrerResult | null {
  for (const medium in referrers) {
    for (const name in referrers[medium]) {
      const referrer = referrers[medium][name];
      // Check if the hostname matches any of the domains in the referrer
      if (referrer.domains.some(domain => exact ? hostname === domain : hostname.endsWith(domain))) {
        // If there are parameters for the referrer, return an object containing the name, medium, and parameters
        const { parameters } = referrer;
        return {
          name,
          medium,
          parameters
        };
      }
    }
  }
  // If no referrer is found, return null
  return null;
}
