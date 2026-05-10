// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseAcceptLanguage } from '../../src/utils/parse-accept-language';

describe('utils:parseAcceptLanguage', () => {
  it('should parse a single language tag without quality', () => {
    const result = parseAcceptLanguage('en-US');
    expect(result.languageCode).toBe('en');
    expect(result.languageRegion).toBe('US');
    expect(result.languageScript).toBeNull();
    expect(result.secondaryLanguageCode).toBeNull();
  });

  it('should parse multiple language tags without quality', () => {
    const result = parseAcceptLanguage('en-US,fr-CA');
    expect(result.languageCode).toBe('en');
    expect(result.languageRegion).toBe('US');
    expect(result.secondaryLanguageCode).toBe('fr');
    expect(result.secondaryLanguageRegion).toBe('CA');
  });

  it('should parse language tags with quality values', () => {
    const result = parseAcceptLanguage('en-US;q=0.8,fr-CA;q=0.9');
    // fr-CA has higher quality, so it's primary
    expect(result.languageCode).toBe('fr');
    expect(result.languageRegion).toBe('CA');
    expect(result.secondaryLanguageCode).toBe('en');
    expect(result.secondaryLanguageRegion).toBe('US');
  });

  it('should parse language tags with script', () => {
    const result = parseAcceptLanguage('zh-Hant-CN');
    expect(result.languageCode).toBe('zh');
    expect(result.languageScript).toBe('Hant');
    expect(result.languageRegion).toBe('CN');
  });

  it('should parse language tags with script without region', () => {
    const result = parseAcceptLanguage('zh-Hant');
    expect(result.languageCode).toBe('zh');
    expect(result.languageScript).toBe('Hant');
    expect(result.languageRegion).toBeNull();
  });

  it('should handle invalid language tags gracefully', () => {
    const result = parseAcceptLanguage('invalid-language-tag');
    expect(result.languageCode).toBeNull();
    expect(result.languageScript).toBeNull();
    expect(result.languageRegion).toBeNull();
  });

  it('should handle empty input gracefully', () => {
    const result = parseAcceptLanguage('');
    expect(result.languageCode).toBeNull();
    expect(result.languageScript).toBeNull();
    expect(result.languageRegion).toBeNull();
    expect(result.secondaryLanguageCode).toBeNull();
  });

  it('should handle mixed valid and invalid language tags', () => {
    const result = parseAcceptLanguage('en-US,invalid-language-tag,fr-CA;q=0.9');
    expect(result.languageCode).toBe('en');
    expect(result.languageRegion).toBe('US');
    expect(result.secondaryLanguageCode).toBe('fr');
    expect(result.secondaryLanguageRegion).toBe('CA');
  });

  it('should parse wildcard language tags', () => {
    const result = parseAcceptLanguage('en-US,*;q=0.8');
    expect(result.languageCode).toBe('en');
    expect(result.languageRegion).toBe('US');
    expect(result.secondaryLanguageCode).toBe('*');
    expect(result.secondaryLanguageRegion).toBeNull();
  });

  it('should sort languages by quality in descending order', () => {
    const result = parseAcceptLanguage('en-US;q=0.8,fr-CA;q=0.9,es-ES;q=0.7');
    expect(result.languageCode).toBe('fr');
    expect(result.languageRegion).toBe('CA');
    expect(result.secondaryLanguageCode).toBe('en');
    expect(result.secondaryLanguageRegion).toBe('US');
  });
});
