// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseUTMParams } from '../../src/utils/parse-utm-params';

describe('utils:parseUTMParams', () => {
  it('should parse UTM parameters correctly from a URL', () => {
    const url = new URL(
      'https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale',
    );
    const result = parseUTMParams(url);

    expect(result.source).toBe('google');
    expect(result.medium).toBe('cpc');
    expect(result.campaign).toBe('summer_sale');
    expect(result.term).toBeNull();
    expect(result.content).toBeNull();
    expect(result.id).toBeNull();
    expect(result.sourcePlatform).toBeNull();
  });

  it('should return null for UTM parameters that are not present', () => {
    const url = new URL('https://example.com?utm_source=facebook');
    const result = parseUTMParams(url);

    expect(result.source).toBe('facebook');
    expect(result.medium).toBeNull();
    expect(result.campaign).toBeNull();
  });

  it('should handle a URL with no UTM parameters', () => {
    const url = new URL('https://example.com');
    const result = parseUTMParams(url);

    expect(result.source).toBeNull();
    expect(result.medium).toBeNull();
    expect(result.campaign).toBeNull();
  });

  it('should handle a URL with UTM parameters in a different order', () => {
    const url = new URL(
      'https://example.com?utm_campaign=winter_sale&utm_medium=email&utm_source=twitter',
    );
    const result = parseUTMParams(url);

    expect(result.source).toBe('twitter');
    expect(result.medium).toBe('email');
    expect(result.campaign).toBe('winter_sale');
  });

  it('should handle UTM parameters with additional query parameters', () => {
    const url = new URL(
      'https://example.com?utm_source=linkedin&utm_medium=paid&utm_campaign=product_launch&other_param=value',
    );
    const result = parseUTMParams(url);

    expect(result.source).toBe('linkedin');
    expect(result.medium).toBe('paid');
    expect(result.campaign).toBe('product_launch');
  });

  it('should parse extended UTM parameters', () => {
    const url = new URL(
      'https://example.com?utm_term=running+shoes&utm_content=hero&utm_id=camp_123&utm_source_platform=google',
    );
    const result = parseUTMParams(url);

    expect(result.term).toBe('running shoes');
    expect(result.content).toBe('hero');
    expect(result.id).toBe('camp_123');
    expect(result.sourcePlatform).toBe('google');
  });
});
