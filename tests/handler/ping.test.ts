import type { PingRequestHandlerResult } from '../../src';
// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { createLitetics, createPingResponse } from '../../src';
import { PingRequestHandler } from '../../src/handler/ping';

const { handlePingRequest } = createLitetics({
  persist: vi.fn(),
  update: vi.fn(),
});

describe('handler:ping', () => {
  it('should return data "0" and status 200 if no if-modified-since header', async () => {
    const getRequestHeader = vi.fn().mockReturnValue(undefined);

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('0');
    expect(result.headers).toHaveProperty('Last-Modified');
    expect(result.headers).toHaveProperty('Cache-Control', 'no-cache');
  });

  it('should return data "0" and status 200 if if-modified-since header is a past date', async () => {
    const pastDate = new Date(Date.now() - 86_400_000).toUTCString();
    const headers = new Headers();
    headers.append('if-modified-since', pastDate);

    const result: PingRequestHandlerResult = await handlePingRequest(
      new Request('https://example.com', { headers }),
    );

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('0');
    expect(result.headers).toHaveProperty('Last-Modified');
    expect(result.headers).toHaveProperty('Cache-Control', 'no-cache');
  });

  it('should return data "1" and status 200 if if-modified-since header is today\'s date', async () => {
    const todayDate = new Date().toUTCString();
    const getRequestHeader = vi.fn().mockReturnValue(todayDate);

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('1');
    expect(result.headers).toHaveProperty('Last-Modified');
    expect(result.headers).toHaveProperty('Cache-Control');
  });

  it('should return data "0" and status 200 if if-modified-since header is an extremely old date', async () => {
    const oldDate = new Date(0).toUTCString();
    const getRequestHeader = vi.fn().mockReturnValue(oldDate);

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('0');
    expect(result.headers).toHaveProperty('Last-Modified');
    expect(result.headers).toHaveProperty('Cache-Control', 'no-cache');
  });

  it('should return error "Bad Request" and status 400 if if-modified-since header is invalid', async () => {
    const getRequestHeader = vi.fn().mockReturnValue('invalid-date');

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(400);
    expect(result.body).toEqual(null);
    expect(result.error).toEqual('Bad Request');
  });

  it('should return error "Bad Request" and status 400 if if-modified-since header is a future date', async () => {
    const futureDate = new Date(Date.now() + 86_400_000).toUTCString();
    const getRequestHeader = vi.fn().mockReturnValue(futureDate);

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(400);
    expect(result.body).toEqual(null);
    expect(result.error).toEqual('Bad Request');
  });

  it('should process via PingRequestHandlerPayload with requestHeaders', async () => {
    const todayDate = new Date().toUTCString();
    const result: PingRequestHandlerResult = await handlePingRequest({
      requestHeaders: { 'if-modified-since': todayDate },
    });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('1');
    expect(result.headers).toHaveProperty('Last-Modified');
    expect(result.headers).toHaveProperty('Cache-Control');
  });

  it('should return error "Bad Request" and status 400 if if-modified-since header is a non-standard date format', async () => {
    const nonStandardDate = 'not-a-real-date';
    const getRequestHeader = vi.fn().mockReturnValue(nonStandardDate);

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(400);
    expect(result.body).toEqual(null);
    expect(result.error).toEqual('Bad Request');
  });

  describe('createPingResponse', () => {
    it('should return a Response with the correct status, headers, and body', async () => {
      const data: PingRequestHandlerResult = {
        status: 200,
        headers: { 'Cache-Control': 'no-cache', 'Last-Modified': 'some-date' },
        body: '0',
      };
      const response = createPingResponse(data);
      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
      expect(response.headers.get('Last-Modified')).toBe('some-date');
      await expect(response.text()).resolves.toBe('0');
    });

    it('should use error as body when present', async () => {
      const data: PingRequestHandlerResult = {
        status: 400,
        headers: {},
        body: null,
        error: 'Bad Request',
      };
      const response = createPingResponse(data);
      expect(response.status).toBe(400);
      await expect(response.text()).resolves.toBe('Bad Request');
    });

    it('should use body when error is undefined', async () => {
      const data: PingRequestHandlerResult = {
        status: 200,
        headers: {},
        body: '1',
      };
      const response = createPingResponse(data);
      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe('1');
    });
  });

  it('should read If-Modified-Since header case-insensitively via payload', async () => {
    const todayDate = new Date().toUTCString();
    const result: PingRequestHandlerResult = await handlePingRequest({
      requestHeaders: { 'If-Modified-Since': todayDate },
    });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('1');
    expect(result.headers).toHaveProperty('Last-Modified');
    expect(result.headers).toHaveProperty('Cache-Control');
  });

  it('should read If-Modified-Since case-insensitively via Request object', async () => {
    const todayDate = new Date().toUTCString();
    const headers = new Headers();
    headers.append('IF-MODIFIED-SINCE', todayDate);

    const result: PingRequestHandlerResult = await handlePingRequest(
      new Request('https://example.com', { headers }),
    );

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('1');
  });

  it('should read If-Modified-Since case-insensitively via getter options', async () => {
    const todayDate = new Date().toUTCString();
    const getRequestHeader = vi.fn((name: string) => {
      if (name.toLowerCase() === 'if-modified-since') return todayDate;
      return undefined;
    });

    const result: PingRequestHandlerResult = await handlePingRequest({ getRequestHeader });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('1');
  });

  it('should log errors when debug is enabled', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { handlePingRequest: debugHandlePingRequest } = createLitetics({
      persist: vi.fn(),
      update: vi.fn(),
      debug: true,
    });

    await debugHandlePingRequest({
      getRequestHeader: vi.fn().mockReturnValue('invalid-date'),
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should return undefined for missing header via payload', async () => {
    const result: PingRequestHandlerResult = await handlePingRequest({
      requestHeaders: {},
    });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual('0');
  });

  it('should construct without options', async () => {
    const handler = new PingRequestHandler();
    const result: PingRequestHandlerResult = await handler.process({
      getRequestHeader: () => undefined,
    });
    expect(result.status).toEqual(200);
    expect(result.body).toEqual('0');
  });
});
