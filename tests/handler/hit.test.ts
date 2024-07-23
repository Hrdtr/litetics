// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { hit } from '../../src/handler/hit';
import type { HitEventLoadRequestBody, HitEventUnloadRequestBody, HitResult } from '../../src/handler/hit';

describe('handler/:hit', () => {
  describe('load event', () => {
    it('should return parsed data for a valid load event', async () => {
      const body: HitEventLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com/path?utm_source=test',
        p: true,
        q: false,
        r: 'https://referrer.com',
        t: 'Europe/London',
        d: { customKey: 'customValue' }
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn((name) => {
        switch (name) {
          case 'accept-language': {
            return 'en-US,en;q=0.9';
          }
          case 'user-agent': {
            return 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20';
          }
          default: {
            return undefined;
          }
        }
      });

      const result: HitResult<'load'> | null = await hit(getRequestBody, getRequestHeader);

      expect(result).toEqual({
        type: 'load',
        data: {
          bid: 'test-beacon-id',
          hostname: 'example.com',
          pathname: '/path',
          isUniqueUser: true,
          isUniquePage: false,
          durationMs: null,
          browserName: 'Mobile Safari',
          browserVersion: '3.1.1',
          browserEngineName: 'WebKit',
          browserEngineVersion: '525.18.1',
          deviceType: 'mobile',
          deviceVendor: 'Apple',
          deviceModel: 'iPhone',
          cpuArchitecture: null,
          osName: 'iOS',
          osVersion: '2.1',
          referrerKnown: true,
          referrerMedium: 'unknown',
          referrerName: null,
          referrerSearchParameter: null,
          referrerSearchTerm: null,
          country: 'GB',
          languageCode: 'en',
          languageScript: null,
          languageRegion: 'US',
          utmCampaign: null,
          utmMedium: null,
          utmSource: 'test',
          additional: { customKey: 'customValue' }
        }
      });
    });

    it('should handle missing referrer URL', async () => {
      const body: HitEventLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      const result: HitResult<'load'> | null = await hit(getRequestBody, getRequestHeader);

      expect(result).toEqual({
        type: 'load',
        data: {
          bid: 'test-beacon-id',
          hostname: 'example.com',
          pathname: '/',
          isUniqueUser: true,
          isUniquePage: true,
          durationMs: null,
          browserName: null,
          browserVersion: null,
          browserEngineName: null,
          browserEngineVersion: null,
          deviceType: 'desktop',
          deviceVendor: null,
          deviceModel: null,
          cpuArchitecture: null,
          osName: null,
          osVersion: null,
          referrerKnown: null,
          referrerMedium: null,
          referrerName: null,
          referrerSearchParameter: null,
          referrerSearchTerm: null,
          country: null,
          languageCode: null,
          languageScript: null,
          languageRegion: null,
          utmCampaign: null,
          utmMedium: null,
          utmSource: null,
          additional: null
        }
      });
    });

    it('should handle invalid URL in referrer', async () => {
      const body: HitEventLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true,
        r: 'invalid-url'
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      const result: HitResult<'load'> | null = await hit(getRequestBody, getRequestHeader);

      expect(result).toEqual({
        type: 'load',
        data: {
          bid: 'test-beacon-id',
          hostname: 'example.com',
          pathname: '/',
          isUniqueUser: true,
          isUniquePage: true,
          durationMs: null,
          browserName: null,
          browserVersion: null,
          browserEngineName: null,
          browserEngineVersion: null,
          deviceType: 'desktop',
          deviceVendor: null,
          deviceModel: null,
          cpuArchitecture: null,
          osName: null,
          osVersion: null,
          referrerKnown: null,
          referrerMedium: null,
          referrerName: null,
          referrerSearchParameter: null,
          referrerSearchTerm: null,
          country: null,
          languageCode: null,
          languageScript: null,
          languageRegion: null,
          utmCampaign: null,
          utmMedium: null,
          utmSource: null,
          additional: null
        }
      });
    });
  });

  describe('unload event', () => {
    it('should return parsed data for a valid unload event', async () => {
      const body: HitEventUnloadRequestBody = {
        e: 'unload',
        b: 'test-beacon-id',
        m: 1234
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      const result: HitResult<'unload'> | null = await hit(getRequestBody, getRequestHeader);

      expect(result).toEqual({
        type: 'unload',
        data: {
          bid: 'test-beacon-id',
          durationMs: 1234
        }
      });
    });

    it('should return null if user-agent indicates a bot', async () => {
      const body: HitEventLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn((name) => {
        if (name === 'user-agent') {
          return 'Googlebot/2.1 (+http://www.google.com/bot.html)';
        }
        return undefined;
      });

      const result: HitResult<'load'> | null = await hit(getRequestBody, getRequestHeader);

      expect(result).toBeNull();
    });

    it('should handle unknown event type', async () => {
      const body = {
        e: 'unknown' as 'load' | 'unload',
        b: 'test-beacon-id'
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      const result: HitResult<'load' | 'unload'> | null = await hit(getRequestBody, getRequestHeader);

      expect(result).toBeNull();
    });
  });
});