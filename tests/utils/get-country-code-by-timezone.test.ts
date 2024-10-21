// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { getCountryCodeByTimezone } from '../../src/utils/get-country-code-by-timezone'

describe('utils:getCountryCodeByTimezone', () => {
  it('should return the country code for a valid timezone', () => {
    const timezone = 'America/New_York'
    const countryCode = getCountryCodeByTimezone(timezone)
    expect(countryCode).toBe('US')
  })

  it('should return the country code for a timezone with multiple countries', () => {
    // This assumes that the mock data has multiple countries for a single timezone
    const timezone = 'Europe/London'
    const countryCode = getCountryCodeByTimezone(timezone)
    expect(countryCode).toBe('GB')
  })

  it('should return null for an invalid timezone', () => {
    const timezone = 'Invalid/Timezone'
    const countryCode = getCountryCodeByTimezone(timezone)
    expect(countryCode).toBe(null)
  })

  it('should return null for an empty timezone', () => {
    const timezone = ''
    const countryCode = getCountryCodeByTimezone(timezone)
    expect(countryCode).toBe(null)
  })
})
