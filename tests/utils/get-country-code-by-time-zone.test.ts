// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { getCountryCodeByTimeZone } from '../../src/utils/get-country-code-by-time-zone';

describe('utils:getCountryCodeByTimeZone', () => {
  it('should return the country code for a valid time zone', () => {
    const timeZone = 'America/New_York';
    const countryCode = getCountryCodeByTimeZone(timeZone);
    expect(countryCode).toBe('US');
  });

  it('should return the country code for another valid time zone', () => {
    // The country-time-zones data has no time zone shared across multiple countries,
    // so this follows the same lookup path as any valid time zone.
    const timeZone = 'Europe/London';
    const countryCode = getCountryCodeByTimeZone(timeZone);
    expect(countryCode).toBe('GB');
  });

  it('should return null for an invalid time zone', () => {
    const timeZone = 'Invalid/TimeZone';
    const countryCode = getCountryCodeByTimeZone(timeZone);
    expect(countryCode).toBe(null);
  });

  it('should return null for an empty time zone', () => {
    const timeZone = '';
    const countryCode = getCountryCodeByTimeZone(timeZone);
    expect(countryCode).toBe(null);
  });
});
