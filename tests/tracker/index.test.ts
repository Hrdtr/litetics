/* eslint-disable unicorn/prefer-global-this */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createTracker } from '../../src/tracker'

const server = setupServer(
  http.get('*', () => HttpResponse.text('0')),
  http.post('*', () => HttpResponse.text('')),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('createTracker', () => {
  it('should throw an error if apiEndpoint.hit is invalid', () => {
    expect(() => createTracker({ apiEndpoint: { hit: 'invalid-url', ping: 'http://example.com' } })).toThrowError('`apiEndpoint.hit` must be a valid URL')
  })

  it('should throw an error if apiEndpoint.ping is invalid', () => {
    expect(() => createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'invalid-url' } })).toThrowError('`apiEndpoint.ping` must be a valid URL')
  })

  it('should create a tracker with default options', () => {
    const tracker = createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'http://example.com' } })
    expect(tracker).toBeDefined()
    expect(tracker.register).toBeDefined()
    expect(tracker.track).toBeDefined()
    expect(tracker.trackEndOf).toBeDefined()
  })
})

describe('register', () => {
  it('should send events correctly', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const sendBeaconMock = vi.fn()
    Object.defineProperty(navigator, 'sendBeacon', { writable: true, value: sendBeaconMock })
    createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'http://example.com' }, sessionTimeoutDuration: 1000 }).register()
    await new Promise(r => setTimeout(r, 1000))
    expect(fetchSpy).toHaveBeenCalledTimes(1) // register load

    window.dispatchEvent(new Event('pagehide'))
    expect(sendBeaconMock).toHaveBeenCalledTimes(1)

    createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'http://example.com' }, sessionTimeoutDuration: 1000 }).register()
    await new Promise(r => setTimeout(r, 1000))
    expect(fetchSpy).toHaveBeenCalledTimes(2) // +1 register load
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    window.dispatchEvent(new Event('visibilitychange'))
    expect(sendBeaconMock).toHaveBeenCalledTimes(1) // still on timeout
    await new Promise(r => setTimeout(r, 1001))
    expect(sendBeaconMock).toHaveBeenCalledTimes(2) // timeout exceeded, unload event should be sent

    createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'http://example.com' }, sessionTimeoutDuration: 1000 }).register()
    await new Promise(r => setTimeout(r, 1000))
    expect(fetchSpy).toHaveBeenCalledTimes(3) // +1 register load
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    window.dispatchEvent(new Event('visibilitychange'))
    expect(sendBeaconMock).toHaveBeenCalledTimes(2) // still on timeout
    await new Promise(r => setTimeout(r, 500))
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false })
    window.dispatchEvent(new Event('visibilitychange'))
    await new Promise(r => setTimeout(r, 501))
    expect(sendBeaconMock).toHaveBeenCalledTimes(2) // no unload event sent since timeout isn't exceeded yet

    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => setTimeout(r, 1000))
    expect(fetchSpy).toHaveBeenCalledTimes(6) // +2 other registered trackers (still listen to popstate)
  })
}, 1000 * 60 * 5)

describe('track', () => {
  it('should call fetch with correct parameters', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    await createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'http://example.com' } }).track('test-event', { type: 'test' })
    expect(fetchSpy).toHaveBeenCalledTimes(1) // track event
  })
})

describe('trackEndOf', () => {
  it('should call fetch with correct parameters', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const tracker = createTracker({ apiEndpoint: { hit: 'http://example.com', ping: 'http://example.com' } })
    await tracker.track('test-event', { type: 'test' }, { withDuration: true })
    await tracker.trackEndOf('test-event')
    expect(fetchSpy).toHaveBeenCalledTimes(2) // track event & track end of event
  })
})
