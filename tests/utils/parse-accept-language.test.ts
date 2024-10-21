// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { parseAcceptLanguage } from '../../src/utils/parse-accept-language'

describe('utils:parseAcceptLanguage', () => {
  it('should parse a single language tag without quality', () => {
    const acceptLanguage = 'en-US'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'en',
        script: null,
        region: 'US',
        quality: 1,
      },
    ])
  })

  it('should parse multiple language tags without quality', () => {
    const acceptLanguage = 'en-US,fr-CA'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'en',
        script: null,
        region: 'US',
        quality: 1,
      },
      {
        code: 'fr',
        script: null,
        region: 'CA',
        quality: 1,
      },
    ])
  })

  it('should parse language tags with quality values', () => {
    const acceptLanguage = 'en-US;q=0.8,fr-CA;q=0.9'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'fr',
        script: null,
        region: 'CA',
        quality: 0.9,
      },
      {
        code: 'en',
        script: null,
        region: 'US',
        quality: 0.8,
      },
    ])
  })

  it('should parse language tags with script', () => {
    const acceptLanguage = 'zh-Hant-CN'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'zh',
        script: 'Hant',
        region: 'CN',
        quality: 1,
      },
    ])
  })

  it('should parse language tags with script without region', () => {
    const acceptLanguage = 'zh-Hant'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'zh',
        script: 'Hant',
        region: null,
        quality: 1,
      },
    ])
  })

  it('should handle invalid language tags gracefully', () => {
    const acceptLanguage = 'invalid-language-tag'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([])
  })

  it('should handle empty input gracefully', () => {
    const acceptLanguage = ''
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([])
  })

  it('should handle mixed valid and invalid language tags', () => {
    const acceptLanguage = 'en-US,invalid-language-tag,fr-CA;q=0.9'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'en',
        region: 'US',
        script: null,
        quality: 1,
      },
      {
        code: 'fr',
        region: 'CA',
        script: null,
        quality: 0.9,
      },
    ])
  })

  it('should parse wildcard language tags', () => {
    const acceptLanguage = 'en-US,*;q=0.8'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'en',
        script: null,
        region: 'US',
        quality: 1,
      },
      {
        code: '*',
        script: null,
        region: null,
        quality: 0.8,
      },
    ])
  })

  it('should sort languages by quality in descending order', () => {
    const acceptLanguage = 'en-US;q=0.8,fr-CA;q=0.9,es-ES;q=0.7'
    const result = parseAcceptLanguage(acceptLanguage)
    expect(result).toEqual([
      {
        code: 'fr',
        script: null,
        region: 'CA',
        quality: 0.9,
      },
      {
        code: 'en',
        script: null,
        region: 'US',
        quality: 0.8,
      },
      {
        code: 'es',
        script: null,
        region: 'ES',
        quality: 0.7,
      },
    ])
  })
})
