// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as handler from '../../src';

describe('handler module exports', () => {
  it('should export createLitetics', () => {
    expect(handler.createLitetics).toBeDefined();
    expect(typeof handler.createLitetics).toBe('function');
  });

  it('should export createPingResponse', () => {
    expect(handler.createPingResponse).toBeDefined();
    expect(typeof handler.createPingResponse).toBe('function');
  });

  it('should export Litetics class', () => {
    expect(handler.Litetics).toBeDefined();
  });
});
