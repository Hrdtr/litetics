// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseReferrer } from '../../src/utils/parse-referrer';

describe('utils:parseReferrer', () => {
  it('should return referrer with internal medium if referrer and current URL are the same', () => {
    const result = parseReferrer('https://example.com', 'https://example.com');
    expect(result.host).toBe('example.com');
    expect(result.medium).toBe('internal');
  });

  it('should handle known referrer with search medium and search parameters', () => {
    const result = parseReferrer('https://google.com/search?q=test', 'https://otherdomain.com');
    expect(result.path).toBe('/search');
    expect(result.queryString).toBe('q=test');
    expect(result.known).toBe(true);
    expect(result.medium).toBe('search');
    expect(result.searchParameter).toBe('q');
    expect(result.searchTerm).toBe('test');
  });

  it('should return referrer with null medium if referrer is not listed', () => {
    const result = parseReferrer('ssh://unknownreferrer.com', 'https://otherdomain.com');
    
    expect(result.known).toBe(false);
    expect(result.medium).toBe(null);
  });

  it('should handle search parameters with mixed case', () => {
    const result = parseReferrer('https://google.com/search?q=test', 'https://otherdomain.com');
    expect(result.known).toBe(true);
    expect(result.medium).toBe('search');
    expect(result.searchParameter).toBe('q');
    expect(result.searchTerm).toBe('test');
  });

  it('should handle empty referrer URL gracefully', () => {
    try {
      const result = parseReferrer('');
      expect(result).toEqual({
        known: false,
        name: null,
        medium: null,
        searchParameter: null,
        searchTerm: null,
        url: new URL(''),
        _src: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toBe('Invalid URL');
    }
  });
});