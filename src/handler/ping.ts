import type { MaybePromise } from '../types'
import { consola } from 'consola'

const log = consola.withTag('litetics:ping')

/**
 * Represents the result of a ping request.
 */
export type PingHandlerResult = {
  /**
   * The HTTP status code of the response.
   */
  status: number
  /**
   * The HTTP headers of the response.
   */
  headers: Record<string, string>
  /**
   * The data which should be returned by the server. Can be '0', '1', or null.
   */
  body: '0' | '1' | null
  /**
   * An error message, if applicable.
   */
  error?: string
}

/**
 * Options to configure the `PingHandler` `ping` method.
 */
export type PingHandlerOptions = {
  /**
   * A function that returns the request header.
   * @param name The name of the header.
   * @returns The value of the header or `undefined` if not present.
   */
  getRequestHeader: (name: string) => MaybePromise<string | null | undefined>
}

/**
 * The payload passed to the `ping` method.
 */
export type PingHandlerPayload = {
  /**
   * The request headers.
   */
  requestHeaders: Record<string, string | null | undefined>
}

export class PingHandler {
  constructor() {}

  /**
   * Process a ping request.
   * @param request The request object.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   * @param options The options to configure the `track` method.
   * @see PingHandlerTrackOptions
   * @param payload The payload to track.
   * @see PingHandlerTrackPayload
   */
  async process(request: Request): Promise<PingHandlerResult>
  async process(options: PingHandlerOptions): Promise<PingHandlerResult>
  async process(payload: PingHandlerPayload): Promise<PingHandlerResult>
  async process(arg: Request | PingHandlerOptions | PingHandlerPayload): Promise<PingHandlerResult> {
    const getRequestHeader = arg instanceof Request
      ? (name: string) => arg.headers.get(name)
      : ('requestHeaders' in arg ? (name: string) => arg.requestHeaders[name] : arg.getRequestHeader)

    // Retrieve the 'if-modified-since' header from the request
    const ifModifiedSince = await getRequestHeader('if-modified-since')
    // Get the current day with time set to 00:00:00.000
    const currentDay = new Date().setHours(0, 0, 0, 0)

    if (!ifModifiedSince) {
      return {
        status: 200,
        headers: {
          // Get the current day with time set to 00:00:00.000
          'Last-Modified': new Date(currentDay).toUTCString(),
          'Cache-Control': 'no-cache',
        },
        body: '0',
        error: undefined,
      }
    }

    const lastModifiedDate = new Date(ifModifiedSince)
    const lastModifiedTime = lastModifiedDate.getTime()

    // If the date is invalid
    if (Number.isNaN(lastModifiedTime) || lastModifiedDate.toUTCString() === 'Invalid Date') {
      log.error('Failed to parse if-modified-since header')
      return {
        status: 400,
        headers: {},
        body: null,
        error: 'Bad Request',
      }
    }
    // If the date is in the future
    if (lastModifiedTime > Date.now()) {
      log.error('if-modified-since header is a future date')
      return {
        status: 400,
        headers: {},
        body: null,
        error: 'Bad Request',
      }
    }

    // If the date is earlier than the current day, we want to reset the cache and mark as a unique visitor.
    if (lastModifiedTime < currentDay) {
      return {
        status: 200,
        headers: {
          // Set 'Last-Modified' header to the start of the current day
          'Last-Modified': new Date(currentDay).toUTCString(),
          'Cache-Control': 'no-cache',
        },
        body: '0',
        error: undefined,
      }
    }

    // If the date is today
    const nextResetTime = new Date(lastModifiedTime + (24 * 60 * 60 * 1000)).getTime()
    // Return a response indicating the visitor is not new for the day
    return {
      status: 200,
      headers: {
        'Last-Modified': ifModifiedSince,
        'Cache-Control': `max-age=${Math.ceil((nextResetTime - Date.now()) / 1000)}`,
      },
      body: '1',
      error: undefined,
    }
  }
}

export function createPingHandler(): PingHandler {
  return new PingHandler()
}

export function createPingResponse(data: PingHandlerResult): Response {
  return new Response(data.error || data.body, {
    status: data.status,
    headers: data.headers,
  })
}
