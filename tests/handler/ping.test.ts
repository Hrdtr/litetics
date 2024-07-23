// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { ping } from '../../src/handler/ping'
import type { PingResult } from '../../src/handler/ping'

describe('handler:ping', () => {
  it('should return data "0" and status 200 if no if-modified-since header', async () => {
    const getRequestHeader = vi.fn().mockReturnValue(undefined);
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);

    expect(result).toEqual({ data: '0', status: 200 });
    expect(setResponseHeader).toHaveBeenCalledWith('Last-Modified', expect.any(String));
    expect(setResponseHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
  });

  it('should return data "0" and status 200 if if-modified-since header is a past date', async () => {
    const pastDate = new Date(Date.now() - 86_400_000).toUTCString(); // 1 day in the past
    const getRequestHeader = vi.fn().mockReturnValue(pastDate);
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);

    expect(result).toEqual({ data: '0', status: 200 });
    expect(setResponseHeader).toHaveBeenCalledWith('Last-Modified', expect.any(String));
    expect(setResponseHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
  });

  it('should return data "1" and status 200 if if-modified-since header is today\'s date', async () => {
    const todayDate = new Date().toUTCString();
    const getRequestHeader = vi.fn().mockReturnValue(todayDate);
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);

    expect(result).toEqual({ data: '1', status: 200 });
    expect(setResponseHeader).toHaveBeenCalledWith('Last-Modified', todayDate);
    expect(setResponseHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
  });

  it('should return data "0" and status 200 if if-modified-since header is an extremely old date', async () => {
    const oldDate = new Date(0).toUTCString(); // Extremely old date (1970)
    const getRequestHeader = vi.fn().mockReturnValue(oldDate);
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);

    expect(result).toEqual({ data: '0', status: 200 });
    expect(setResponseHeader).toHaveBeenCalledWith('Last-Modified', expect.any(String));
    expect(setResponseHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
  });

  it('should return error "Bad Request" and status 400 if if-modified-since header is invalid', async () => {
    const getRequestHeader = vi.fn().mockReturnValue('invalid-date');
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);
    expect(result).toEqual({ data: null, error: 'Bad Request', status: 400 });
  });

  it('should return error "Bad Request" and status 400 if if-modified-since header is a future date', async () => {
    const futureDate = new Date(Date.now() + 86_400_000).toUTCString(); // 1 day in the future
    const getRequestHeader = vi.fn().mockReturnValue(futureDate);
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);
    expect(result).toEqual({ data: null, error: 'Bad Request', status: 400 });
  });

  it('should return error "Bad Request" and status 400 if if-modified-since header is a non-standard date format', async () => {
    const nonStandardDate = 'not-a-real-date'; // Non-standard format
    const getRequestHeader = vi.fn().mockReturnValue(nonStandardDate);
    const setResponseHeader = vi.fn();

    const result: PingResult = await ping(getRequestHeader, setResponseHeader);
    expect(result).toEqual({ data: null, error: 'Bad Request', status: 400 });
  });
});
