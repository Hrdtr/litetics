import { countryTimezones } from "../data/country-timezones"

/**
 * Retrieves the country code based on the provided timezone.
 *
 * @param {string} timezone - The timezone for which to retrieve the country code.
 * @return {string | null} The country code corresponding to the timezone, or null if not found.
 */
export const getCountryCodeByTimezone = (timezone: string): string | null => {
  const [countryCode] = Object.entries(countryTimezones).find(([, timezones]) => timezones.includes(timezone)) ?? []
  return countryCode || null
}