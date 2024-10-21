// @vitest-environment node
import { describe, it, expect } from 'vitest'

import * as handler from '../../src/handler'

describe('handle module exports', () => {
  it('should export hit function', () => {
    expect(handler.hit).toBeDefined()
    expect(typeof handler.hit).toBe('function')
  })

  it('should export ping function', () => {
    expect(handler.ping).toBeDefined()
    expect(typeof handler.ping).toBe('function')
  })
})
