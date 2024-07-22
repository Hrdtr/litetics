// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseUserAgent } from '../../src/utils/parse-user-agent';

describe('utils:parseUserAgent', () => {
  it('should parse a basic user agent string', () => {
    const uaString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    const result = parseUserAgent(uaString);

    expect(result.browser.name).toBe('Chrome');
    expect(result.browser.version).toBe('91.0.4472.124');
    expect(result.device.model).toBe(undefined);
    expect(result.device.type).toBe(undefined);
    expect(result.device.vendor).toBe(undefined);
    expect(result.cpu.architecture).toBe('amd64');
    expect(result.engine.name).toBe('Blink');
    expect(result.engine.version).toBe('91.0.4472.124');
    expect(result.os.name).toBe('Windows');
    expect(result.os.version).toBe('10');
    expect(result._src).toBe(uaString);
  });

  it('should parse a user agent string with mobile device', () => {
    const uaString = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    const result = parseUserAgent(uaString);

    expect(result.browser.name).toBe('Mobile Safari');
    expect(result.browser.version).toBe('14.0');
    expect(result.device.model).toBe('iPhone');
    expect(result.device.type).toBe('mobile');
    expect(result.device.vendor).toBe('Apple');
    expect(result.cpu.architecture).toBe(undefined);
    expect(result.engine.name).toBe('WebKit');
    expect(result.engine.version).toBe('605.1.15');
    expect(result.os.name).toBe('iOS');
    expect(result.os.version).toBe('14.0');
    expect(result._src).toBe(uaString);
  });

  it('should handle empty user agent string', () => {
    const uaString = '';
    const result = parseUserAgent(uaString);

    expect(result.browser.name).toBe(undefined);
    expect(result.browser.version).toBe(undefined);
    expect(result.device.model).toBe(undefined);
    expect(result.device.type).toBe(undefined);
    expect(result.device.vendor).toBe(undefined);
    expect(result.cpu.architecture).toBe(undefined);
    expect(result.engine.name).toBe(undefined);
    expect(result.engine.version).toBe(undefined);
    expect(result.os.name).toBe(undefined);
    expect(result.os.version).toBe(undefined);
    expect(result._src).toBe(uaString);
  });

  it('should handle unknown user agent string', () => {
    const uaString = 'unknown-agent';
    const result = parseUserAgent(uaString);

    expect(result.browser.name).toBe(undefined);
    expect(result.browser.version).toBe(undefined);
    expect(result.device.model).toBe(undefined);
    expect(result.device.type).toBe(undefined);
    expect(result.device.vendor).toBe(undefined);
    expect(result.cpu.architecture).toBe(undefined);
    expect(result.engine.name).toBe(undefined);
    expect(result.engine.version).toBe(undefined);
    expect(result.os.name).toBe(undefined);
    expect(result.os.version).toBe(undefined);
    expect(result._src).toBe(uaString);
  });
});
