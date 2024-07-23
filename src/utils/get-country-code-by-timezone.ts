import { countryTimezones } from "../data/country-timezones"

export const getCountryCodeByTimezone = (timezone: string) => {
  const [countryCode] = Object.entries(countryTimezones).find(([, timezones]) => timezones.includes(timezone)) ?? []
  return countryCode || null
}