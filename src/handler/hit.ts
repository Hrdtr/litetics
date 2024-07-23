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

export interface HitEventLoadRequestBody {
  e: 'load' // Event name
  b: string // Beacon ID
  u: string // Page URL
  p: boolean // If the user is unique or not
  q: boolean // If this is the first time the user has visited this specific page
  a: 'pageview' | (string & { _?: never }) // Event type
  r?: string // Referrer URL
  t?: string // Timezone of the user
  d?: { // Optional custom event data
    [key: string]: string | number | boolean | null | undefined
  }
}

export interface HitEventUnloadRequestBody {
  e: 'unload' // Event name
  b: string // Beacon ID
  m: number // Duration in MS
}

export type HitResult = {
  load: {
    event: 'load',
    data: EventData
  },
  unload: {
    event: 'unload',
    data: Pick<EventData, 'bid'> & { durationMs: NonNullable<EventData['durationMs']> }
  }
}
export const hit = async <T extends (HitEventLoadRequestBody | HitEventUnloadRequestBody)>(
  getRequestBody: () => T | Promise<T>,
  getRequestHeader: (name: string) => string | undefined,
): Promise<(0 extends 1 & T ? HitResult[keyof HitResult] : HitResult[T['e']]) | null> => {
  const acceptLanguage = getRequestHeader('accept-language') || null
  const userAgent = getRequestHeader('user-agent') || null
  if (userAgent && isbot(userAgent)) {
    log.debug('User agent is a bot')
    return null
  }

  let body = await getRequestBody()
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      log.error('Failed to parse body as JSON')
      return null
    }
  }

  const eventType = body.e

  switch (eventType) {
    case 'load': {
      if (body.u && !isValidUrl(body.u)) {
        // early return if the URL is invalid
        return null
      }
      if (body.r && !isValidUrl(body.r)) {
        // omit the referrer if the referrer URL is invalid
        body.r = undefined
      }

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
    
      const url = new URL(pageUrl)
      const hostname = url.hostname
      const pathname = url.pathname === '/' ? url.pathname : url.pathname.replace(/\/$/, '')
    
      const ua = userAgent && userAgent.length > 0 ? parseUserAgent(userAgent) : null
      const browserName = ua?.browser.name || null
      const browserVersion = ua?.browser.version || null
      const browserEngineName = ua?.engine.name || null
      const browserEngineVersion = ua?.engine.version || null
      const deviceType = ua?.device.type || 'desktop'
      const deviceVendor = ua?.device.vendor || null
      const deviceModel = ua?.device.model || null
      const cpuArchitecture = ua?.cpu.architecture || null
      const osName = ua?.os.name || null
      const osVersion = ua?.os.version || null
    
      const {
        host: referrerHost = null,
        path: referrerPath = null,
        queryString: referrerQueryString = null,
        known: referrerKnown = null,
        medium: referrerMedium = null,
        name: referrerName = null,
        searchParameter: referrerSearchParameter = null,
        searchTerm: referrerSearchTerm = null,
      } = referrer && isValidUrl(referrer) ? parseReferrer(referrer) : {}
    
      const country = timezone && timezone.length > 0
        ? getCountryCodeByTimezone(timezone)
        : null
    
      const languages = acceptLanguage && acceptLanguage.length > 0
        ? parseAcceptLanguage(acceptLanguage) || []
        : []
      const languageCode = languages[0]?.code || null
      const languageScript = languages[0]?.script || null
      const languageRegion = languages[0]?.region || null
      const secondaryLanguageCode = languages[1]?.code || null
      const secondaryLanguageScript = languages[1]?.script || null
      const secondaryLanguageRegion = languages[1]?.region || null
    
      const {
        campaign: utmCampaign,
        medium: utmMedium,
        source: utmSource
      } = parseUTMParams(url)

      return {
        event: 'load',
        data: {
          bid,
          hostname,
          pathname,
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
      log.debug('Unknown event received: ' + eventType)
      return null
    }
  }
}
