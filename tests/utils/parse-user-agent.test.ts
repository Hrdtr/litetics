// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseUserAgent } from '../../src/utils/parse-user-agent';

describe('utils:parseUserAgent', () => {
  it('should parse a basic user agent string', () => {
    const uaString =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    const result = parseUserAgent(uaString);

    expect(result.browserName).toBe('Chrome');
    expect(result.browserVersion).toBe('91.0.4472.124');
    expect(result.browserEngineName).toBe('Blink');
    expect(result.browserEngineVersion).toBe('91.0.4472.124');
    expect(result.deviceModel).toBeNull();
    expect(result.deviceType).toBeNull();
    expect(result.deviceVendor).toBeNull();
    expect(result.cpuArchitecture).toBe('amd64');
    expect(result.osName).toBe('Windows');
    expect(result.osVersion).toBe('10');
  });

  it('should parse a user agent string with mobile device', () => {
    const uaString =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    const result = parseUserAgent(uaString);

    expect(result.browserName).toBe('Mobile Safari');
    expect(result.browserVersion).toBe('14.0');
    expect(result.browserEngineName).toBe('WebKit');
    expect(result.browserEngineVersion).toBe('605.1.15');
    expect(result.deviceModel).toBe('iPhone');
    expect(result.deviceType).toBe('mobile');
    expect(result.deviceVendor).toBe('Apple');
    expect(result.cpuArchitecture).toBeNull();
    expect(result.osName).toBe('iOS');
    expect(result.osVersion).toBe('14.0');
  });

  it('should handle empty user agent string', () => {
    const uaString = '';
    const result = parseUserAgent(uaString);

    expect(result.browserName).toBeNull();
    expect(result.browserVersion).toBeNull();
    expect(result.browserEngineName).toBeNull();
    expect(result.browserEngineVersion).toBeNull();
    expect(result.deviceModel).toBeNull();
    expect(result.deviceType).toBeNull();
    expect(result.deviceVendor).toBeNull();
    expect(result.cpuArchitecture).toBeNull();
    expect(result.osName).toBeNull();
    expect(result.osVersion).toBeNull();
  });

  it('should handle unknown user agent string', () => {
    const uaString = 'unknown-agent';
    const result = parseUserAgent(uaString);

    expect(result.browserName).toBeNull();
    expect(result.browserVersion).toBeNull();
    expect(result.browserEngineName).toBeNull();
    expect(result.browserEngineVersion).toBeNull();
    expect(result.deviceModel).toBeNull();
    expect(result.deviceType).toBeNull();
    expect(result.deviceVendor).toBeNull();
    expect(result.cpuArchitecture).toBeNull();
    expect(result.osName).toBeNull();
    expect(result.osVersion).toBeNull();
  });

  it('should handle malformed user agent without throwing', () => {
    const ua = 'x'.repeat(10000);
    expect(() => parseUserAgent(ua)).not.toThrow();
  });
});
