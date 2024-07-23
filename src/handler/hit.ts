import { consola } from 'consola'
import { isbot } from 'isbot'
import { parseReferrer } from '../utils/parse-referrer'
import { getCountryCodeByTimezone } from '../utils/get-country-code-by-timezone'
import { parseAcceptLanguage } from '../utils/parse-accept-language'
import { parseUserAgent } from '../utils/parse-user-agent'
import { parseUTMParams } from '../utils/parse-utm-params'
import { isValidUrl } from '../utils/is-valid-url'
import type { EventData, EventDurationData } from '../types'

const log = consola.withTag('litetics:hit')

export interface HitEventLoadRequestBody {
  e: 'load' // Event type
  b: string // Beacon ID
  u: string // Page URL
  p: boolean // If the user is unique or not
  q: boolean // If this is the first time the user has visited this specific page
  r?: string // Referrer URL
  t?: string // Timezone of the user
  d?: { // Optional custom event data
    [key: string]: string | number | boolean | null | undefined
  }
}

export interface HitEventUnloadRequestBody {
  e: 'unload' // Event type
  b: string // Beacon ID
  m: number // Duration in MS
}

export interface HitResult<T extends 'load' | 'unload' = 'load'> {
  type: T,
  data: {
    load: EventData,
    unload: EventDurationData,
  }[T]
}
export const hit = async <
  T extends HitEventLoadRequestBody | HitEventUnloadRequestBody,
  U = HitResult<T['e']>
>(
  getRequestBody: () => T | Promise<T>,
  getRequestHeader: (name: string) => string | undefined,
): Promise<U | null> => {
  const acceptLanguage = getRequestHeader('accept-language')
  const uaString = getRequestHeader('user-agent')
  if (uaString && isbot(uaString)) {
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
      const {
        b: bid,
        u: pageUrl,
        p: isUniqueUser,
        q: isUniquePage,
        r: referrerUrl = null,
        t: timezone = null,
        d: additional = null,
      } = body
    
      const url = new URL(pageUrl)
      const hostname = url.hostname
      const pathname = url.pathname === '/' ? url.pathname : url.pathname.replace(/\/$/, '')
    
      const ua = uaString && uaString.length > 0 ? parseUserAgent(uaString) : null
      const browserName = ua?.browser.name ?? null
      const browserVersion = ua?.browser.version ?? null
      const browserEngineName = ua?.engine.name ?? null
      const browserEngineVersion = ua?.engine.version ?? null
      const deviceType = ua?.device.type ?? 'desktop'
      const deviceVendor = ua?.device.vendor ?? null
      const deviceModel = ua?.device.model ?? null
      const cpuArchitecture = ua?.cpu.architecture ?? null
      const osName = ua?.os.name ?? null
      const osVersion = ua?.os.version ?? null
    
      const {
        known: referrerKnown = null,
        medium: referrerMedium = null,
        name: referrerName = null,
        searchParameter: referrerSearchParameter = null,
        searchTerm: referrerSearchTerm = null,
      } = referrerUrl && isValidUrl(referrerUrl) ? parseReferrer(referrerUrl) : {
        known: null,
        medium: null,
        name: null,
        searchParameter: null,
        searchTerm: null
      }
    
      const country = timezone && timezone.length > 0
        ? getCountryCodeByTimezone(timezone)
        : null
    
      const language = acceptLanguage && acceptLanguage.length > 0
        ? (parseAcceptLanguage(acceptLanguage).shift() ?? null)
        : null
      const languageCode = language?.code ?? null
      const languageScript = language?.script ?? null
      const languageRegion = language?.region ?? null
    
      const {
        campaign: utmCampaign,
        medium: utmMedium,
        source: utmSource
      } = parseUTMParams(url)

      return {
        type: 'load',
        data: {
          bid,
          hostname,
          pathname,
          isUniqueUser,
          isUniquePage,
          // optional fields
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
          referrerKnown,
          referrerMedium,
          referrerName,
          referrerSearchParameter,
          referrerSearchTerm,
          country,
          languageCode,
          languageScript,
          languageRegion,
          utmCampaign,
          utmMedium,
          utmSource,
          additional
        } satisfies EventData
      } as U
    }

    case 'unload': {
      const {
        b: bid,
        m: durationMs
      } = body
      return {
        type: 'unload',
        data: {
          bid,
          durationMs
        } satisfies EventDurationData
      } as U
    }
  
    default: {
      log.debug('Unknown event type received: ' + eventType)
      return null
    }
  }
}
