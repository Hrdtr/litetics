// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseReferrer } from '../../src/utils/parse-referrer';

describe('utils:parseReferrer', () => {
  it('should return referrer with internal medium if referrer and current URL are the same', () => {
    const result = parseReferrer('https://example.com', 'https://example.com');
    expect(result.referrerHost).toBe('example.com');
    expect(result.referrerMedium).toBe('internal');
  });

  it('should handle known referrer with search medium and search parameters', () => {
    const result = parseReferrer('https://google.com/search?q=test', 'https://otherdomain.com');
    expect(result.referrerPath).toBe('/search');
    expect(result.referrerQueryString).toBe('q=test');
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('search');
    expect(result.referrerSearchParameter).toBe('q');
    expect(result.referrerSearchTerm).toBe('test');
  });

  it('should return referrer with null medium if referrer is not listed', () => {
    const result = parseReferrer('ssh://unknownreferrer.com', 'https://otherdomain.com');

    expect(result.referrerKnown).toBe(false);
    expect(result.referrerMedium).toBeNull();
  });

  it('should handle search parameters with mixed case', () => {
    const result = parseReferrer('https://google.com/search?q=test', 'https://otherdomain.com');
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('search');
    expect(result.referrerSearchParameter).toBe('q');
    expect(result.referrerSearchTerm).toBe('test');
  });

  it('should handle empty referrer URL gracefully', () => {
    expect(() => parseReferrer('')).toThrow(TypeError);
  });

  it('should match known referrer exactly when hostname is in domain list', () => {
    const result = parseReferrer('https://google.com/search?q=exact-match', 'https://other.com');
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('search');
    expect(result.referrerSearchTerm).toBe('exact-match');
  });

  it('should match known referrer non-exactly when hostname ends with a listed domain', () => {
    const result = parseReferrer('https://sub.google.com/search?q=non-exact', 'https://other.com');
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('search');
    expect(result.referrerSearchTerm).toBe('non-exact');
  });

  it('should identify known referrer with unknown medium', () => {
    const result = parseReferrer('https://support.google.com/accounts', 'https://other.com');
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('unknown');
    expect(result.referrerName).toBe('Google');
  });

  it('should skip unknown search parameters', () => {
    const result = parseReferrer(
      'https://google.com/search?q=valid&unknown_param=skip',
      'https://other.com',
    );
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('search');
    // 'q' is known, 'unknown_param' is not — should be skipped
    expect(result.referrerSearchParameter).toBe('q');
    expect(result.referrerSearchTerm).toBe('valid');
  });

  it('should keep first search parameter when multiple match', () => {
    // Yandex has 'text' as search parameter
    const result = parseReferrer(
      'https://yandex.ru/search?text=first&text=second',
      'https://other.com',
    );
    expect(result.referrerKnown).toBe(true);
    expect(result.referrerMedium).toBe('search');
    // Should keep the first occurrence
    expect(result.referrerSearchParameter).toBe('text');
    expect(result.referrerSearchTerm).toBe('first');
  });
});
