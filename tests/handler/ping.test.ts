// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createPingHandler } from '../../src'
import type { PingHandlerResult } from '../../src'

const pingHandler = createPingHandler()

describe('handler:ping', () => {
  it('should return data "0" and status 200 if no if-modified-since header', async () => {
    const getRequestHeader = vi.fn().mockReturnValue(undefined)

    const result: PingHandlerResult = await pingHandler.process({ getRequestHeader })

    expect(result.status).toEqual(200)
    expect(result.body).toEqual('0')
    expect(result.headers).toHaveProperty('Last-Modified')
    expect(result.headers).toHaveProperty('Cache-Control', 'no-cache')
  })

  it('should return data "0" and status 200 if if-modified-since header is a past date', async () => {
    const pastDate = new Date(Date.now() - 86_400_000).toUTCString() // 1 day in the past
    const headers = new Headers()
    headers.append('if-modified-since', pastDate)

    const result: PingHandlerResult = await pingHandler.process(new Request('https://example.com', { headers }))

    expect(result.status).toEqual(200)
    expect(result.body).toEqual('0')
    expect(result.headers).toHaveProperty('Last-Modified')
    expect(result.headers).toHaveProperty('Cache-Control', 'no-cache')
  })

  it('should return data "1" and status 200 if if-modified-since header is today\'s date', async () => {
    const todayDate = new Date().toUTCString()
    const getRequestHeader = vi.fn().mockReturnValue(todayDate)

    const result: PingHandlerResult = await pingHandler.process({ getRequestHeader })

    expect(result.status).toEqual(200)
    expect(result.body).toEqual('1')
    expect(result.headers).toHaveProperty('Last-Modified')
    expect(result.headers).toHaveProperty('Cache-Control')
  })

  it('should return data "0" and status 200 if if-modified-since header is an extremely old date', async () => {
    const oldDate = new Date(0).toUTCString() // Extremely old date (1970)
    const getRequestHeader = vi.fn().mockReturnValue(oldDate)

    const result: PingHandlerResult = await pingHandler.process({ getRequestHeader })

    expect(result.status).toEqual(200)
    expect(result.body).toEqual('0')
    expect(result.headers).toHaveProperty('Last-Modified')
    expect(result.headers).toHaveProperty('Cache-Control', 'no-cache')
  })

  it('should return error "Bad Request" and status 400 if if-modified-since header is invalid', async () => {
    const getRequestHeader = vi.fn().mockReturnValue('invalid-date')

    const result: PingHandlerResult = await pingHandler.process({ getRequestHeader })

    expect(result.status).toEqual(400)
    expect(result.body).toEqual(null)
    expect(result.error).toEqual('Bad Request')
  })

  it('should return error "Bad Request" and status 400 if if-modified-since header is a future date', async () => {
    const futureDate = new Date(Date.now() + 86_400_000).toUTCString() // 1 day in the future
    const getRequestHeader = vi.fn().mockReturnValue(futureDate)

    const result: PingHandlerResult = await pingHandler.process({ getRequestHeader })

    expect(result.status).toEqual(400)
    expect(result.body).toEqual(null)
    expect(result.error).toEqual('Bad Request')
  })

  it('should return error "Bad Request" and status 400 if if-modified-since header is a non-standard date format', async () => {
    const nonStandardDate = 'not-a-real-date' // Non-standard format
    const getRequestHeader = vi.fn().mockReturnValue(nonStandardDate)

    const result: PingHandlerResult = await pingHandler.process({ getRequestHeader })

    expect(result.status).toEqual(400)
    expect(result.body).toEqual(null)
    expect(result.error).toEqual('Bad Request')
  })
})
