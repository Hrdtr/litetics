import { countryTimezones } from '../data/country-timezones';

const timezoneToCountry: Record<string, string> = {};
for (const [countryCode, timezones] of Object.entries(countryTimezones)) {
  for (const timezone of timezones) {
    timezoneToCountry[timezone] = countryCode;
  }
}

/**
 * Retrieves the country code based on the provided timezone.
 *
 * @param {string} timezone - The timezone for which to retrieve the country code.
 * @return {string | null} The country code corresponding to the timezone, or null if not found.
 */
export const getCountryCodeByTimezone = (timezone: string): string | null => {
  return timezoneToCountry[timezone] ?? null;
};
