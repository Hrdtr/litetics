import type { EventData, MaybePromise, Primitive } from '../types';
import type { ParsedAcceptLanguage } from '../utils/parse-accept-language';
import type { ParsedReferrer } from '../utils/parse-referrer';
import type { ParsedUserAgent } from '../utils/parse-user-agent';
import type { ParsedUTMParams } from '../utils/parse-utm-params';
import { isbot } from 'isbot';
import { getCountryCodeByTimeZone } from '../utils/get-country-code-by-time-zone';
import { isValidUrl } from '../utils/is-valid-url';
import { parseAcceptLanguage } from '../utils/parse-accept-language';
import { parseReferrer } from '../utils/parse-referrer';
import { parseUserAgent } from '../utils/parse-user-agent';
import { parseUTMParams } from '../utils/parse-utm-params';

const defaultUA = {
  browserName: null as null,
  browserVersion: null as null,
  browserEngineName: null as null,
  browserEngineVersion: null as null,
  deviceType: null as null,
  deviceVendor: null as null,
  deviceModel: null as null,
  cpuArchitecture: null as null,
  osName: null as null,
  osVersion: null as null,
};

const defaultRef = {
  referrerHost: null as null,
  referrerPath: null as null,
  referrerQueryString: null as null,
  referrerKnown: null as null,
  referrerMedium: null as null,
  referrerName: null as null,
  referrerSearchParameter: null as null,
  referrerSearchTerm: null as null,
};

const defaultLang = {
  languageCode: null as null,
  languageScript: null as null,
  languageRegion: null as null,
  secondaryLanguageCode: null as null,
  secondaryLanguageScript: null as null,
  secondaryLanguageRegion: null as null,
};

/**
 * An object representing a payload of event to track.
 * This object is sent to the server in a `POST` request.
 */
export interface EventRequestHandlerLoadRequestBody {
  /**
   * The name of the event. Always 'load'
   */
  e: 'load';

  /**
   * The beacon ID.
   */
  b: string;

  /**
   * The URL of the page.
   */
  u: string;

  /**
   * Flag indicating if the user is unique.
   */
  p: boolean;

  /**
   * Flag indicating if this is the first time the user has visited this specific page.
   */
  q: boolean;

  /**
   * The type of event.
   */
  a: 'pageview' | (string & { _?: never });

  /**
   * The URL of the referrer. Optional.
   */
  r?: string;

  /**
   * The time zone of the user. Optional.
   */
  t?: string;

  /**
   * Custom event data. Optional.
   * @example
   * {
   *   customKey: 'customValue'
   * }
   */
  d?: {
    [key: string]: string | number | boolean | null | undefined;
  };
}

/**
 * An object representing follow-up data used to track the duration of an event.
 * This object is sent to the server in a `POST` request.
 */
export interface EventRequestHandlerUnloadRequestBody {
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
 * The load event result.
 */
export type EventRequestHandlerLoadResult = EventData;

/**
 * The unload event result.
 */
export type EventRequestHandlerUnloadResult = Pick<EventData, 'bid'> & {
  durationMs: NonNullable<EventData['durationMs']>;
};

/**
 * Overridable parser functions. Each parser falls back to the built-in
 * implementation when not provided.
 */
export interface EventRequestHandlerParsers {
  userAgent?: (ua: string) => ParsedUserAgent;
  referrer?: (referrerUrl: string, currentUrl: string) => ParsedReferrer;
  acceptLanguage?: (header: string) => ParsedAcceptLanguage;
  utm?: (url: URL) => ParsedUTMParams;
}

/**
 * Options to configure the `EventRequestHandler`.
 */
export type EventRequestHandlerOptions<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> = {
  /**
   * Persists the `EventRequestHandlerLoadResult` data.
   * @param data The `EventRequestHandlerLoadResult` data.
   * @returns Void or promise of void.
   */
  persist: (
    data: EventRequestHandlerLoadResult & { properties: TProperties | null },
  ) => MaybePromise<void>;

  /**
   * Updates the persisted data with the `EventRequestHandlerUnloadResult` data.
   * @param data The `EventRequestHandlerUnloadResult` data.
   * @returns Void or promise of void.
   */
  update: (data: EventRequestHandlerUnloadResult) => MaybePromise<void>;

  /**
   * When true, logs debug information to console. Defaults to `false`.
   */
  debug?: boolean;

  /**
   * Overridable parser functions. When not provided the built-in parsers
   * are used. Supply custom parsers to enrich, replace, or skip parsing
   * for specific fields.
   */
  parsers?: EventRequestHandlerParsers;

  /**
   * Determines whether a user-agent should be treated as a bot.
   * Receives the raw user-agent string and returns `true` to skip
   * processing. Defaults to `isbot` from the `isbot` package.
   */
  shouldIgnoreUserAgent?: (ua: string) => boolean;
};

/**
 * Options to configure the `EventRequestHandler` `track` method.
 */
export type EventRequestHandlerTrackOptions = {
  /**
   * A function that returns the request body.
   * @returns The request body.
   */
  getRequestBody: () =>
    | MaybePromise<EventRequestHandlerLoadRequestBody>
    | MaybePromise<EventRequestHandlerUnloadRequestBody>;

  /**
   * A function that returns the request header.
   * @param name The name of the header.
   * @returns The value of the header or `undefined` if not present.
   */
  getRequestHeader: (name: string) => MaybePromise<string | null | undefined>;
};

/**
 * The payload passed to the `track` method.
 */
export type EventRequestHandlerTrackPayload = {
  /**
   * The request body.
   */
  requestBody: EventRequestHandlerLoadRequestBody | EventRequestHandlerUnloadRequestBody;

  /**
   * The request headers.
   */
  requestHeaders: Record<string, string | null | undefined>;
};

export class EventRequestHandler<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> {
  private options: EventRequestHandlerOptions<TProperties>;

  constructor(options: EventRequestHandlerOptions<TProperties>) {
    this.options = options;
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (!this.options.debug) return;
    console[level](`[litetics:event] ${message}`);
  }

  private parseUrl(pageUrl: string): {
    host: string;
    path: string;
    queryString: string | null;
    hash: string | null;
  } {
    const url = new URL(pageUrl);
    return {
      host: url.hostname,
      path: url.pathname === '/' ? url.pathname : url.pathname.replace(/\/$/, ''),
      queryString: url.searchParams.toString() || null,
      hash: url.hash || null,
    };
  }

  async track(request: Request): Promise<void>;
  async track(options: EventRequestHandlerTrackOptions): Promise<void>;
  async track(payload: EventRequestHandlerTrackPayload): Promise<void>;
  async track(
    arg: Request | EventRequestHandlerTrackOptions | EventRequestHandlerTrackPayload,
  ): Promise<void> {
    const getRequestBody =
      arg instanceof Request
        ? () =>
            arg.text().then((t: string) => {
              try {
                return JSON.parse(t);
              } catch {
                return t;
              }
            })
        : 'requestBody' in arg
          ? () => arg.requestBody
          : arg.getRequestBody;

    const getRequestHeader =
      arg instanceof Request
        ? (name: string) => arg.headers.get(name)
        : 'requestHeaders' in arg
          ? (name: string) => {
              const h = arg.requestHeaders;
              const key = Object.keys(h).find((k) => k.toLowerCase() === name.toLowerCase());
              return key ? h[key] : undefined;
            }
          : arg.getRequestHeader;

    const acceptLanguage = (await getRequestHeader('accept-language')) || null;
    const userAgent = (await getRequestHeader('user-agent')) || null;

    if (userAgent && (this.options.shouldIgnoreUserAgent ?? isbot)(userAgent)) {
      this.log('debug', `User agent ignored: ${userAgent}`);
      return;
    }

    let body: EventRequestHandlerLoadRequestBody | EventRequestHandlerUnloadRequestBody =
      await getRequestBody();
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        this.log('error', 'Failed to parse body as JSON');
        return;
      }
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      this.log('error', 'Invalid JSON body structure');
      return;
    }
    const eventType = body.e;

    switch (eventType) {
      case 'load': {
        const {
          b: bid,
          u: pageUrl,
          p: isUniqueUser,
          q: isUniquePage,
          a: type,
          r: rawReferrer,
          t: rawTimeZone,
          d: rawProperties,
        } = body;

        if (typeof pageUrl !== 'string' || !pageUrl) return;
        if (!isValidUrl(pageUrl)) return;
        if (typeof bid !== 'string' || !bid) return;
        if (typeof isUniqueUser !== 'boolean') return;
        if (typeof isUniquePage !== 'boolean') return;
        if (typeof type !== 'string' || !type) return;

        const referrer: string | null =
          rawReferrer !== undefined && rawReferrer !== null
            ? typeof rawReferrer === 'string' && isValidUrl(rawReferrer)
              ? rawReferrer
              : null
            : null;

        const timeZone: string | null =
          rawTimeZone !== undefined && rawTimeZone !== null
            ? typeof rawTimeZone === 'string'
              ? rawTimeZone
              : null
            : null;

        const properties: Record<string, Primitive> | null =
          rawProperties !== undefined && rawProperties !== null
            ? typeof rawProperties === 'object' && !Array.isArray(rawProperties)
              ? (rawProperties as Record<string, Primitive>)
              : null
            : null;

        const receivedAt = new Date();
        const country = timeZone ? getCountryCodeByTimeZone(timeZone) : null;

        const { host, path, queryString, hash } = this.parseUrl(pageUrl);
        const {
          campaign: utmCampaign,
          medium: utmMedium,
          source: utmSource,
          term: utmTerm,
          content: utmContent,
          id: utmId,
          sourcePlatform: utmSourcePlatform,
        } = (this.options.parsers?.utm ?? parseUTMParams)(new URL(pageUrl));

        const {
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
        } = userAgent ? (this.options.parsers?.userAgent ?? parseUserAgent)(userAgent) : defaultUA;

        const {
          referrerHost,
          referrerPath,
          referrerQueryString,
          referrerKnown,
          referrerMedium,
          referrerName,
          referrerSearchParameter,
          referrerSearchTerm,
        } = referrer
          ? (this.options.parsers?.referrer ?? parseReferrer)(referrer, pageUrl)
          : defaultRef;

        const {
          languageCode,
          languageScript,
          languageRegion,
          secondaryLanguageCode,
          secondaryLanguageScript,
          secondaryLanguageRegion,
        } = acceptLanguage
          ? (this.options.parsers?.acceptLanguage ?? parseAcceptLanguage)(acceptLanguage)
          : defaultLang;

        const data: EventData = {
          bid,
          receivedAt,
          host,
          path,
          queryString,
          hash,
          isUniqueUser,
          isUniquePage,
          type,
          durationMs: null,
          timeZone,
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
          utmTerm,
          utmContent,
          utmId,
          utmSourcePlatform,
          properties,
        };

        await this.options.persist(
          data as EventRequestHandlerLoadResult & { properties: TProperties | null },
        );
        break;
      }

      case 'unload': {
        const { b: bid, m: durationMs } = body;
        if (
          typeof bid !== 'string' ||
          bid.length === 0 ||
          typeof durationMs !== 'number' ||
          !Number.isFinite(durationMs) ||
          durationMs < 0
        ) {
          this.log('error', 'Invalid unload payload');
          return;
        }
        await this.options.update({ bid, durationMs: durationMs });
        break;
      }

      default: {
        this.log('debug', `Unknown event received: ${eventType}`);
      }
    }
  }
}
