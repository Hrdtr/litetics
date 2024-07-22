// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { isValidUrl } from '../../src/utils/is-valid-url';

describe('utils:isValidUrl', () => {
  it('should return true for a valid URL with default options', () => {
    const url = 'https://example.com';
    const result = isValidUrl(url);
    expect(result).toBe(true);
  });

  it('should return true for a valid URL with matching protocols', () => {
    const url = 'http://example.com';
    const result = isValidUrl(url, { matchProtocols: 'http:' });
    expect(result).toBe(true);
  });

  it('should return false for a valid URL with non-matching protocols', () => {
    const url = 'https://example.com';
    const result = isValidUrl(url, { matchProtocols: 'http:' });
    expect(result).toBe(false);
  });

  it('should return false for an invalid URL format', () => {
    const url = 'not-a-valid-url';
    const result = isValidUrl(url);
    expect(result).toBe(false);
  });

  it('should return false for an empty string', () => {
    const url = '';
    const result = isValidUrl(url);
    expect(result).toBe(false);
  });

  it('should return true for a URL with a non-standard protocol if it is not restricted in options', () => {
    const url = 'ftp://example.com';
    const result = isValidUrl(url);
    expect(result).toBe(true);
  });

  it('should return false for a URL with a non-standard protocol if it is restricted in options', () => {
    const url = 'ftp://example.com';
    const result = isValidUrl(url, { matchProtocols: 'http:' });
    expect(result).toBe(false);
  });
});