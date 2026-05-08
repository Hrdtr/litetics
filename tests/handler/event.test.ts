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

      expect(mockPersist).toHaveBeenCalledWith(
        expect.objectContaining({
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
          referrer: 'https://referrer.com',
          acceptLanguage: 'en-US,en;q=0.9',
          properties: { customKey: 'customValue' },
        }),
      );

      const data = mockPersist.mock.calls[0][0];
      expect(data.browserName).toBe('Mobile Safari');
      expect(data.browserVersion).toBe('3.1.1');
      expect(data.browserEngineName).toBe('WebKit');
      expect(data.deviceType).toBe('mobile');
      expect(data.deviceVendor).toBe('Apple');
      expect(data.deviceModel).toBe('iPhone');
      expect(data.osName).toBe('iOS');
      expect(data.osVersion).toBe('2.1');
      expect(data.referrerHost).toBe('referrer.com');
      expect(data.referrerKnown).toBe(false);
      expect(data.languageCode).toBe('en');
      expect(data.languageRegion).toBe('US');
      expect(data.utmSource).toBe('test');
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

      expect(mockPersist).toHaveBeenCalledWith(
        expect.objectContaining({
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
          referrer: 'https://referrer.com',
          acceptLanguage: 'en-US,en;q=0.9',
          properties: { customKey: 'customValue' },
        }),
      );

      const data = mockPersist.mock.calls[0][0];
      expect(data.browserName).toBe('Mobile Safari');
      expect(data.browserVersion).toBe('3.1.1');
      expect(data.deviceType).toBe('mobile');
      expect(data.osName).toBe('iOS');
      expect(data.referrerHost).toBe('referrer.com');
      expect(data.referrerKnown).toBe(false);
      expect(data.languageCode).toBe('en');
      expect(data.languageRegion).toBe('US');
      expect(data.utmSource).toBe('test');
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

      expect(mockPersist).toHaveBeenCalledWith(
        expect.objectContaining({
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
          referrer: null,
          acceptLanguage: null,
          properties: null,
        }),
      );

      const data = mockPersist.mock.calls[0][0];
      expect(data.browserName).toBeNull();
      expect(data.referrerHost).toBeNull();
      expect(data.languageCode).toBeNull();
      expect(data.utmSource).toBeNull();
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

      expect(mockPersist).toHaveBeenCalledWith(
        expect.objectContaining({
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
          referrer: null,
          acceptLanguage: null,
          properties: null,
        }),
      );

      const data = mockPersist.mock.calls[0][0];
      expect(data.browserName).toBeNull();
      expect(data.referrerHost).toBeNull();
      expect(data.referrerKnown).toBeNull();
      expect(data.languageCode).toBeNull();
      expect(data.utmSource).toBeNull();
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

  describe('case-insensitive headers', () => {
    it('should detect bot with upper-case User-Agent header via payload', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'case-bot',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      await eventHandler.track({
        requestBody: body,
        requestHeaders: { 'USER-AGENT': 'Googlebot/2.1' },
      });

      expect(mockPersist).toBeCalledTimes(0);
    });

    it('should detect bot with upper-case User-Agent header via Request object', async () => {
      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify({
          e: 'load',
          b: 'req-bot',
          u: 'https://example.com',
          p: true,
          q: true,
          a: 'pageview',
        }),
        headers: { 'USER-AGENT': 'Googlebot/2.1' },
      });

      await eventHandler.track(request);

      const botCall = mockPersist.mock.calls.find(
        (args) => (args[0] as Record<string, unknown>).bid === 'req-bot',
      );
      expect(botCall).toBeUndefined();
    });

    it('should detect bot with upper-case User-Agent header via getter options', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'opt-bot',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const getRequestHeader = vi.fn((name: string) => {
        if (name.toLowerCase() === 'user-agent') return 'Googlebot/2.1';
        return undefined;
      });

      await eventHandler.track({
        getRequestBody: vi.fn().mockResolvedValue(body),
        getRequestHeader,
      });

      const botCall = mockPersist.mock.calls.find(
        (args) => (args[0] as Record<string, unknown>).bid === 'opt-bot',
      );
      expect(botCall).toBeUndefined();
    });

    it('should read accept-language with mixed-case key via payload', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'case-lang',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await eventHandler.track({
        requestBody: body,
        requestHeaders: { 'Accept-Language': 'de-DE,de;q=0.9' },
      });

      vi.useRealTimers();

      expect(mockPersist).toHaveBeenCalledWith(
        expect.objectContaining({
          bid: 'case-lang',
          languageCode: 'de',
          languageRegion: 'DE',
        }),
      );
    });

    it('should read accept-language with upper-case key via Request object', async () => {
      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify({
          e: 'load',
          b: 'req-lang',
          u: 'https://example.com',
          p: true,
          q: true,
          a: 'pageview',
        }),
        headers: { 'ACCEPT-LANGUAGE': 'ja-JP,ja;q=0.9' },
      });

      await eventHandler.track(request);
      vi.useRealTimers();

      const call = mockPersist.mock.calls.find(
        (args) => (args[0] as Record<string, unknown>).bid === 'req-lang',
      );
      expect(call).toBeDefined();
      const data = call![0] as Record<string, unknown>;
      expect(data.languageCode).toBe('ja');
      expect(data.languageRegion).toBe('JP');
    });

    it('should read accept-language with mixed-case key via getter options', async () => {
      const body: EventHandlerLoadRequestBody = {
        e: 'load',
        b: 'opt-lang',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      };

      const receivedAt = new Date(1998, 11, 19);
      vi.useFakeTimers();
      vi.setSystemTime(receivedAt);

      await eventHandler.track({
        getRequestBody: vi.fn().mockResolvedValue(body),
        getRequestHeader: vi.fn((name: string) => {
          if (name.toLowerCase() === 'accept-language') return 'ko-KR,ko;q=0.8';
          return undefined;
        }),
      });

      vi.useRealTimers();

      const call = mockPersist.mock.calls.find(
        (args) => (args[0] as Record<string, unknown>).bid === 'opt-lang',
      );
      expect(call).toBeDefined();
      const data = call![0] as Record<string, unknown>;
      expect(data.languageCode).toBe('ko');
      expect(data.languageRegion).toBe('KR');
    });
  });

  describe('debug mode', () => {
    it('should log bot detection when debug is enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const handler = createEventHandler({
        persist: mockPersist,
        update: mockUpdate,
        debug: true,
      });

      const request = new Request('https://example.com', {
        method: 'POST',
        body: JSON.stringify({
          e: 'load',
          b: 'debug-bot',
          u: 'https://example.com',
          p: true,
          q: true,
          a: 'pageview',
        }),
        headers: { 'user-agent': 'Googlebot/2.1' },
      });

      await handler.track(request);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('request parsing', () => {
    it('should handle non-JSON text body via Request object', async () => {
      const persistCount = mockPersist.mock.calls.length;

      const request = new Request('https://example.com', {
        method: 'POST',
        body: 'plain text body, not json',
      });

      await eventHandler.track(request);

      // Body can't be parsed as JSON, so persist should not be called again
      expect(mockPersist.mock.calls.length).toBe(persistCount);
    });
  });
});
