import { consola } from 'consola'
import { isbot } from 'isbot'
import { parseReferrer } from '../utils/parse-referrer'
import { getCountryCodeByTimezone } from '../utils/get-country-code-by-timezone'
import { parseAcceptLanguage } from '../utils/parse-accept-language'
import { parseUserAgent } from '../utils/parse-user-agent'
import { parseUTMParams } from '../utils/parse-utm-params'
import { isValidUrl } from '../utils/is-valid-url'
import type { EventData } from '../types'

const log = consola.withTag('litetics:hit')

/**
 * An object representing a payload of event to track.
 * This object is sent to the server in a `POST` request.
 */
export interface HitEventLoadRequestBody {
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
export interface HitEventUnloadRequestBody {
  /**
   * The event name. Always 'unload'
   */
  e: 'unload';

  /**
   * The beacon ID.
   */
  b: string;

  /**
   * The duration in MS.
   */
  m: number;
}

/**
 * An object representing the result of a hit event handler.
 */
export type HitResult = {
  /**
   * The load event result.
   */
  load: {
    /**
     * The event name. Always 'load'.
     */
    event: 'load',
    /**
     * The result of the load event.
     */
    data: EventData,
  },
  /**
   * The unload event result.
   */
  unload: {
    /**
     * The event name. Always 'unload'.
     */
    event: 'unload',
    /**
     * The result of the unload event.
     * This includes the beacon ID and the duration in milliseconds.
     */
    data: Pick<EventData, 'bid'> & {
      durationMs: NonNullable<EventData['durationMs']>,
    },
  },
}
/**
 * Handles a hit event.
 *
 * @param {() => T | Promise<T>} getRequestBody - A function that returns the request body.
 * @param {(name: string) => string | undefined} getRequestHeader - A function that returns the value of a request header.
 * @return {Promise<(0 extends 1 & T ? HitResult[keyof HitResult] : HitResult[T['e']]) | null>} A promise that resolves to the result of the hit event or null.
 */
export const hit = async <T extends (HitEventLoadRequestBody | HitEventUnloadRequestBody)>(
  getRequestBody: () => T | Promise<T>,
  getRequestHeader: (name: string) => string | undefined,
): Promise<(0 extends 1 & T ? HitResult[keyof HitResult] : HitResult[T['e']]) | null> => {
  const acceptLanguage = getRequestHeader('accept-language') || null
  const userAgent = getRequestHeader('user-agent') || null

  // Check if the user agent is a bot
  if (userAgent && isbot(userAgent)) {
    log.debug('User agent is a bot')
    return null
  }

  // Parse the request body
  let body = await getRequestBody()
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      // Log an error message if the body cannot be parsed as JSON
      log.error('Failed to parse body as JSON')
      return null
    }
  }

  // Get the event type from the request body
  const eventType = body.e

  switch (eventType) {
    case 'load': {
      // Handle the load event
      if (body.u && !isValidUrl(body.u)) {
        // Early return if the URL is invalid
        return null
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
        source: utmSource
      } = parseUTMParams(url)

      // Return the load event result
      return {
        event: 'load',
        data: {
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
          additional
        }
      } as HitResult[T['e']]
    }

    case 'unload': {
      // Handle the unload event
      const {
        b: bid,
        m: durationMs
      } = body
      return {
        event: 'unload',
        data: {
          bid,
          durationMs
        }
      } as HitResult[T['e']]
    }
  
    default: {
      // Log a debug message if the event type is unknown
      log.debug('Unknown event received: ' + eventType)
      return null
    }
  }
}
