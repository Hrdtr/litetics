// @vitest-environment node
import { describe, it, expect } from 'vitest'

import * as handler from '../../src'

describe('handle module exports', () => {
  it('should export createEventHandler function', () => {
    expect(handler.createEventHandler).toBeDefined()
    expect(typeof handler.createEventHandler).toBe('function')
  })

  it('should export createPingHandler function', () => {
    expect(handler.createPingHandler).toBeDefined()
    expect(typeof handler.createPingHandler).toBe('function')
  })
})
