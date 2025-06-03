import type { EventData, MaybePromise } from '../types'
import { consola } from 'consola'
import { isbot } from 'isbot'
import { getCountryCodeByTimezone } from '../utils/get-country-code-by-timezone'
import { isValidUrl } from '../utils/is-valid-url'
import { parseAcceptLanguage } from '../utils/parse-accept-language'
import { parseReferrer } from '../utils/parse-referrer'
import { parseUserAgent } from '../utils/parse-user-agent'
import { parseUTMParams } from '../utils/parse-utm-params'

const log = consola.withTag('litetics:event')

/**
 * An object representing a payload of event to track.
 * This object is sent to the server in a `POST` request.
 */
export interface EventHandlerLoadRequestBody {
  /**
   * The name of the event. Always 'load'
   */
  e: 'load'

  /**
   * The beacon ID.
   */
  b: string

  /**
   * The URL of the page.
   */
  u: string

  /**
   * Flag indicating if the user is unique.
   */
  p: boolean

  /**
   * Flag indicating if this is the first time the user has visited this specific page.
   */
  q: boolean

  /**
   * The type of event.
   */
  a: 'pageview' | (string & { _?: never })

  /**
   * The URL of the referrer. Optional.
   */
  r?: string

  /**
   * The timezone of the user. Optional.
   */
  t?: string

  /**
   * Custom event data. Optional.
   * @example
   * {
   *   customKey: 'customValue'
   * }
   */
  d?: {
    [key: string]: string | number | boolean | null | undefined
  }
}

/**
 * An object representing follow-up data used to track the duration of an event.
 * This object is sent to the server in a `POST` request.
 */
export interface EventHandlerUnloadRequestBody {
  /**
   * The event name. Always 'unload'
   */
  e: 'unload'

  /**
   * The beacon ID.
   */
  b: string

  /**
   * The duration in MS.
   */
  m: number
}

/**
 * The load event result.
 */
export type EventHandlerLoadResult = EventData

/**
 * The unload event result.
 */
export type EventHandlerUnloadResult = Pick<EventData, 'bid'> & {
  durationMs: NonNullable<EventData['durationMs']>
}

/**
 * Options to configure the `EventHandler`.
 */
export type EventHandlerOptions = {
  /**
   * Persists the `EventHandlerLoadResult` data.
   * @param data The `EventHandlerLoadResult` data.
   * @returns Void or promise of void.
   */
  persist: (data: EventHandlerLoadResult) => MaybePromise<void>

  /**
   * Updates the persisted data with the `EventHandlerUnloadResult` data.
   * @param data The `EventHandlerUnloadResult` data.
   * @returns Void or promise of void.
   */
  update: (data: EventHandlerUnloadResult) => MaybePromise<void>
}

/**
 * Options to configure the `EventHandler` `track` method.
 */
export type EventHandlerTrackOptions = {
  /**
   * A function that returns the request body.
   * @returns The request body.
   */
  getRequestBody: () => MaybePromise<EventHandlerLoadRequestBody> | MaybePromise<EventHandlerUnloadRequestBody>

  /**
   * A function that returns the request header.
   * @param name The name of the header.
   * @returns The value of the header or `undefined` if not present.
   */
  getRequestHeader: (name: string) => MaybePromise<string | null | undefined>
}

/**
 * The payload passed to the `track` method.
 */
export type EventHandlerTrackPayload = {
  /**
   * The request body.
   */
  requestBody: EventHandlerLoadRequestBody | EventHandlerUnloadRequestBody

  /**
   * The request headers.
   */
  requestHeaders: Record<string, string | null | undefined>
}

export class EventHandler {
  private options: EventHandlerOptions

  /**
   * @param options The options to configure the `EventHandler`.
   * @see EventHandlerOptions
   */
  constructor(options: EventHandlerOptions) {
    this.options = options
  }

  /**
   * Tracks a hit event.
   * @param request The request object.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   * @param options The options to configure the `track` method.
   * @see EventHandlerTrackOptions
   * @param payload The payload to track.
   * @see EventHandlerTrackPayload
   */
  async track(request: Request): Promise<void>
  async track(options: EventHandlerTrackOptions): Promise<void>
  async track(payload: EventHandlerTrackPayload): Promise<void>
  async track(arg: Request | EventHandlerTrackOptions | EventHandlerTrackPayload): Promise<void> {
    const getRequestBody = arg instanceof Request
      ? () => arg.json().catch(() => arg.text())
      : ('requestBody' in arg ? () => arg.requestBody : arg.getRequestBody)

    const getRequestHeader = arg instanceof Request
      ? (name: string) => arg.headers.get(name)
      : ('requestHeaders' in arg ? (name: string) => arg.requestHeaders[name] : arg.getRequestHeader)

    const acceptLanguage = await getRequestHeader('accept-language') || null
    const userAgent = await getRequestHeader('user-agent') || null

    // Check if the user agent is a bot
    if (userAgent && isbot(userAgent)) {
      log.debug('User agent is a bot')
      return
    }

    // Parse the request body
    let body = await getRequestBody()
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      }
      catch {
        // Log an error message if the body cannot be parsed as JSON
        log.error('Failed to parse body as JSON')
        return
      }
    }

    // Get the event type from the request body
    const eventType = body.e

    switch (eventType) {
      case 'load': {
        // Handle the load event
        if (body.u && !isValidUrl(body.u)) {
          // Early return if the URL is invalid
          return
        }
        if (body.r && !isValidUrl(body.r)) {
          // Omit the referrer if the referrer URL is invalid
          body.r = undefined
        }

        // Destructure the properties from the request body
        const {
          b: bid,
          u: pageUrl,
          p: isUniqueUser,
          q: isUniquePage,
          a: type,
          r: referrer = null,
          t: timezone = null,
          d: additional = null,
        } = body

        const receivedAt = new Date()

        // Parse the page URL
        const url = new URL(pageUrl)
        const host = url.hostname
        const path = url.pathname === '/' ? url.pathname : url.pathname.replace(/\/$/, '')
        const queryString = url.searchParams.toString() || null

        // Parse the user agent
        const ua = userAgent && userAgent.length > 0 ? parseUserAgent(userAgent) : null
        const browserName = ua?.browser.name || null
        const browserVersion = ua?.browser.version || null
        const browserEngineName = ua?.browserEngine.name || null
        const browserEngineVersion = ua?.browserEngine.version || null
        const deviceType = ua?.device.type || null
        const deviceVendor = ua?.device.vendor || null
        const deviceModel = ua?.device.model || null
        const cpuArchitecture = ua?.cpu.architecture || null
        const osName = ua?.os.name || null
        const osVersion = ua?.os.version || null

        // Parse the referrer URL
        const {
          host: referrerHost = null,
          path: referrerPath = null,
          queryString: referrerQueryString = null,
          known: referrerKnown = null,
          medium: referrerMedium = null,
          name: referrerName = null,
          searchParameter: referrerSearchParameter = null,
          searchTerm: referrerSearchTerm = null,
        } = referrer && isValidUrl(referrer) ? parseReferrer(referrer, pageUrl) : {}

        // Get the country code based on the timezone
        const country = timezone && timezone.length > 0
          ? getCountryCodeByTimezone(timezone)
          : null

        // Parse the accept language header
        const languages = acceptLanguage && acceptLanguage.length > 0
          ? parseAcceptLanguage(acceptLanguage)
          : []
        const languageCode = languages[0]?.code || null
        const languageScript = languages[0]?.script || null
        const languageRegion = languages[0]?.region || null
        const secondaryLanguageCode = languages[1]?.code || null
        const secondaryLanguageScript = languages[1]?.script || null
        const secondaryLanguageRegion = languages[1]?.region || null

        // Parse the UTM parameters from the URL
        const {
          campaign: utmCampaign,
          medium: utmMedium,
          source: utmSource,
        } = parseUTMParams(url)

        await this.options.persist({
          bid,
          receivedAt,
          host,
          path,
          queryString,
          isUniqueUser,
          isUniquePage,
          type,
          // optional fields
          durationMs: null,
          timezone,
          country,
          userAgent,
          browserName,
          browserVersion,
          browserEngineName,
          browserEngineVersion,
          deviceType,
          deviceVendor,
          deviceModel,
          cpuArchitecture,
          osName,
          osVersion,
          referrer,
          referrerHost,
          referrerPath,
          referrerQueryString,
          referrerKnown,
          referrerMedium,
          referrerName,
          referrerSearchParameter,
          referrerSearchTerm,
          acceptLanguage,
          languageCode,
          languageScript,
          languageRegion,
          secondaryLanguageCode,
          secondaryLanguageScript,
          secondaryLanguageRegion,
          utmCampaign,
          utmMedium,
          utmSource,
          additional,
        })

        break
      }

      case 'unload': {
        // Handle the unload event
        const {
          b: bid,
          m: durationMs,
        } = body

        await this.options.update({
          bid,
          durationMs,
        })

        break
      }

      default: {
        // Log a debug message if the event type is unknown
        log.debug('Unknown event received: ' + eventType)
      }
    }
  }
}

export function createEventHandler(options: EventHandlerOptions): EventHandler {
  return new EventHandler(options)
}
