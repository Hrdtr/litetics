import type { EventHandlerLoadRequestBody, EventHandlerUnloadRequestBody } from '../../src';
// @vitest-environment node
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { createEventHandler } from '../../src';

const mockPersist = vi.fn();
const mockUpdate = vi.fn();
const eventHandler = createEventHandler({ persist: mockPersist, update: mockUpdate });

describe('handler:event', () => {
  describe('load event', () => {
    beforeEach(() => {
      mockPersist.mockClear();
    });

    it('should return parsed data for a valid load event', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com/path?utm_source=test',
        p: true,
        q: false,
        a: 'pageview',
        r: 'https://referrer.com',
        t: 'Europe/London',
        d: { customKey: 'customValue' },
      };

      const getRequestBody = vi.fn<() => EventHandlerLoadRequestBody>().mockResolvedValue(body);
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

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await eventHandler.track({ getRequestBody, getRequestHeader });
      vi.useRealTimers();

      expect(mockPersist).toBeCalledWith({
        bid: 'test-beacon-id',
        receivedAt,
        host: 'example.com',
        path: '/path',
        queryString: 'utm_source=test',
        isUniqueUser: true,
        isUniquePage: false,
        type: 'pageview',
        durationMs: null,
        timezone: 'Europe/London',
        country: 'GB',
        userAgent:
          'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
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
        referrer: 'https://referrer.com',
        referrerHost: 'referrer.com',
        referrerPath: '/',
        referrerQueryString: null,
        referrerKnown: false,
        referrerMedium: null,
        referrerName: null,
        referrerSearchParameter: null,
        referrerSearchTerm: null,
        acceptLanguage: 'en-US,en;q=0.9',
        languageCode: 'en',
        languageScript: null,
        languageRegion: 'US',
        secondaryLanguageCode: 'en',
        secondaryLanguageScript: null,
        secondaryLanguageRegion: null,
        utmCampaign: null,
        utmMedium: null,
        utmSource: 'test',
        utmTerm: null,
        utmContent: null,
        utmId: null,
        utmSourcePlatform: null,
        properties: { customKey: 'customValue' },
      });
    });

    it('should return parsed data for a valid load event from stringified json', async () => {
      const body = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com/path?utm_source=test',
        p: true,
        q: false,
        a: 'pageview',
        r: 'https://referrer.com',
        t: 'Europe/London',
        d: { customKey: 'customValue' },
      };

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
          'accept-language': 'en-US,en;q=0.9',
          'user-agent':
            'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
        }),
      });

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await eventHandler.track(request);
      vi.useRealTimers();

      expect(mockPersist).toBeCalledWith({
        bid: 'test-beacon-id',
        receivedAt,
        host: 'example.com',
        path: '/path',
        queryString: 'utm_source=test',
        isUniqueUser: true,
        isUniquePage: false,
        type: 'pageview',
        durationMs: null,
        timezone: 'Europe/London',
        country: 'GB',
        userAgent:
          'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5F136 Safari/525.20',
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
        referrer: 'https://referrer.com',
        referrerHost: 'referrer.com',
        referrerPath: '/',
        referrerQueryString: null,
        referrerKnown: false,
        referrerMedium: null,
        referrerName: null,
        referrerSearchParameter: null,
        referrerSearchTerm: null,
        acceptLanguage: 'en-US,en;q=0.9',
        languageCode: 'en',
        languageScript: null,
        languageRegion: 'US',
        secondaryLanguageCode: 'en',
        secondaryLanguageScript: null,
        secondaryLanguageRegion: null,
        utmCampaign: null,
        utmMedium: null,
        utmSource: 'test',
        utmTerm: null,
        utmContent: null,
        utmId: null,
        utmSourcePlatform: null,
        properties: { customKey: 'customValue' },
      });
    });

    it('should not call persist when handler failed to parse load event from stringified json', async () => {
      const body = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com/path?utm_source=test',
        p: true,
        q: false,
        a: 'pageview',
        r: 'https://referrer.com',
        t: 'Europe/London',
        d: { customKey: 'customValue' },
      };

      const getRequestBody = vi
        .fn<() => EventHandlerLoadRequestBody>()
        .mockResolvedValue(JSON.stringify(body).slice(1) as unknown as EventHandlerLoadRequestBody);
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

      await eventHandler.track({ getRequestBody, getRequestHeader });
      expect(mockPersist).toBeCalledTimes(0);
    });

    it('should not call persist when `u` body parameter is not valid url', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'example/path?utm_source=test',
        p: true,
        q: false,
        a: 'pageview',
        r: 'https://referrer.com',
        t: 'Europe/London',
        d: { customKey: 'customValue' },
      };

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      await eventHandler.track(request);
      expect(mockPersist).toBeCalledTimes(0);
    });

    it('should handle missing referrer URL', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const getRequestBody = vi.fn<() => EventHandlerLoadRequestBody>().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await eventHandler.track({ getRequestBody, getRequestHeader });
      vi.useRealTimers();

      expect(mockPersist).toBeCalledWith({
        bid: 'test-beacon-id',
        receivedAt,
        host: 'example.com',
        path: '/',
        queryString: null,
        isUniqueUser: true,
        isUniquePage: true,
        type: 'pageview',
        durationMs: null,
        timezone: null,
        country: null,
        userAgent: null,
        browserName: null,
        browserVersion: null,
        browserEngineName: null,
        browserEngineVersion: null,
        deviceType: null,
        deviceVendor: null,
        deviceModel: null,
        cpuArchitecture: null,
        osName: null,
        osVersion: null,
        referrer: null,
        referrerHost: null,
        referrerPath: null,
        referrerQueryString: null,
        referrerKnown: null,
        referrerMedium: null,
        referrerName: null,
        referrerSearchParameter: null,
        referrerSearchTerm: null,
        acceptLanguage: null,
        languageCode: null,
        languageScript: null,
        languageRegion: null,
        secondaryLanguageCode: null,
        secondaryLanguageScript: null,
        secondaryLanguageRegion: null,
        utmCampaign: null,
        utmMedium: null,
        utmSource: null,
        utmTerm: null,
        utmContent: null,
        utmId: null,
        utmSourcePlatform: null,
        properties: null,
      });
    });

    it('should handle invalid URL in referrer', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
        r: 'invalid-url',
      };

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await eventHandler.track({
        requestBody: body,
        requestHeaders: {},
      });
      vi.useRealTimers();

      expect(mockPersist).toBeCalledWith({
        bid: 'test-beacon-id',
        receivedAt,
        host: 'example.com',
        path: '/',
        queryString: null,
        isUniqueUser: true,
        isUniquePage: true,
        type: 'pageview',
        durationMs: null,
        timezone: null,
        country: null,
        userAgent: null,
        browserName: null,
        browserVersion: null,
        browserEngineName: null,
        browserEngineVersion: null,
        deviceType: null,
        deviceVendor: null,
        deviceModel: null,
        cpuArchitecture: null,
        osName: null,
        osVersion: null,
        referrer: null,
        referrerHost: null,
        referrerPath: null,
        referrerQueryString: null,
        referrerKnown: null,
        referrerMedium: null,
        referrerName: null,
        referrerSearchParameter: null,
        referrerSearchTerm: null,
        acceptLanguage: null,
        languageCode: null,
        languageScript: null,
        languageRegion: null,
        secondaryLanguageCode: null,
        secondaryLanguageScript: null,
        secondaryLanguageRegion: null,
        utmCampaign: null,
        utmMedium: null,
        utmSource: null,
        utmTerm: null,
        utmContent: null,
        utmId: null,
        utmSourcePlatform: null,
        properties: null,
      });
    });

    it('should not call persist if user-agent indicates a bot for load event', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
          'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        }),
      });

      await eventHandler.track(request);

      expect(mockPersist).toBeCalledTimes(0);
    });

    it('should not call persist when body.u is empty', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'id',
        u: '',
        p: true,
        q: true,
        a: 'pageview',
      };

      const getRequestBody = vi.fn<() => EventHandlerLoadRequestBody>().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      await eventHandler.track({ getRequestBody, getRequestHeader });

      expect(mockPersist).toBeCalledTimes(0);
    });

    it('should run middleware and allow modification of data', async () => {
      const middleware = vi.fn((ctx) => {
        ctx.data.additional = { enriched: true };
      });
      const handler = createEventHandler({
        persist: mockPersist,
        update: mockUpdate,
        middlewares: [middleware],
      });

      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);
      await handler.track({
        getRequestBody: vi.fn().mockResolvedValue(body),
        getRequestHeader: vi.fn(() => undefined),
      });
      vi.useRealTimers();

      expect(middleware).toHaveBeenCalledTimes(1);
      expect(mockPersist).toHaveBeenCalledWith(
        expect.objectContaining({ additional: { enriched: true } }),
      );
    });

    it('should abort when middleware aborts', async () => {
      const middleware = vi.fn((ctx) => {
        ctx.abort();
      });
      const handler = createEventHandler({
        persist: mockPersist,
        update: mockUpdate,
        middlewares: [middleware],
      });

      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      await handler.track({
        getRequestBody: vi.fn().mockResolvedValue(body),
        getRequestHeader: vi.fn(() => undefined),
      });

      expect(middleware).toHaveBeenCalledTimes(1);
      expect(mockPersist).toBeCalledTimes(0);
    });

    it('should handle async persist', async () => {
      const asyncPersist = vi.fn().mockResolvedValue(undefined);
      const asyncUpdate = vi.fn().mockResolvedValue(undefined);
      const handler = createEventHandler({ persist: asyncPersist, update: asyncUpdate });

      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const getRequestBody = vi.fn<() => EventHandlerLoadRequestBody>().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await handler.track({ getRequestBody, getRequestHeader });
      vi.useRealTimers();

      expect(asyncPersist).toBeCalledTimes(1);
      expect(asyncPersist).toHaveResolved();
    });
  });

  describe('unload event', () => {
    beforeEach(() => {
      mockUpdate.mockClear();
    });

    it('should run middleware for unload event', async () => {
      const middleware = vi.fn();
      const handler = createEventHandler({
        persist: mockPersist,
        update: mockUpdate,
        middlewares: [middleware],
      });

      const body: EventHandlerUnloadRequestBody = {
        e: 'unload',
        b: 'id',
        m: 1000,
      };

      await handler.track({
        getRequestBody: vi.fn().mockResolvedValue(body),
        getRequestHeader: vi.fn(() => undefined),
      });

      expect(middleware).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({ bid: 'id', durationMs: 1000 });
    });

    it('should return parsed data for a valid unload event', async () => {
      const body: EventHandlerUnloadRequestBody = {
        e: 'unload',
        b: 'test-beacon-id',
        m: 1234,
      };

      const getRequestBody = vi.fn<() => EventHandlerUnloadRequestBody>().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      await eventHandler.track({ getRequestBody, getRequestHeader });

      expect(mockUpdate).toBeCalledWith({
        bid: 'test-beacon-id',
        durationMs: 1234,
      });
    });

    it('should not call persist if user-agent indicates a bot', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'test-beacon-id',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
          'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        }),
      });

      await eventHandler.track(request);

      expect(mockUpdate).toBeCalledTimes(0);
    });

    it('should handle unknown event', async () => {
      const body = {
        e: 'unknown' as 'load' | 'unload',
        b: 'test-beacon-id',
      };

      const getRequestBody = vi.fn().mockResolvedValue(body);
      const getRequestHeader = vi.fn(() => undefined);

      await eventHandler.track({ getRequestBody, getRequestHeader });

      expect(mockUpdate).toBeCalledTimes(0);
    });

    it('should handle unload event via Request object', async () => {
      const body: EventHandlerUnloadRequestBody = {
        e: 'unload',
        b: 'test-beacon-id',
        m: 5678,
      };

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      await eventHandler.track(request);

      expect(mockUpdate).toBeCalledWith({
        bid: 'test-beacon-id',
        durationMs: 5678,
      });
    });
  });
});
