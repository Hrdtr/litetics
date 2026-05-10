import { countryTimeZones } from '../data/country-time-zones';

const timeZoneToCountry: Record<string, string> = {};
for (const [countryCode, timeZones] of Object.entries(countryTimeZones)) {
  for (const timeZone of timeZones) {
    timeZoneToCountry[timeZone] = countryCode;
  }
}

/**
 * Retrieves the country code based on the provided time zone.
 *
 * @param {string} timeZone - The time zone for which to retrieve the country code.
 * @return {string | null} The country code corresponding to the time zone, or null if not found.
 */
export const getCountryCodeByTimeZone = (timeZone: string): string | null => {
  return timeZoneToCountry[timeZone] ?? null;
};
