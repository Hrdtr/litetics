import type { EventData, MaybePromise, Primitive } from '../types';
import type { ParsedAcceptLanguage } from '../utils/parse-accept-language';
import type { ParsedReferrer } from '../utils/parse-referrer';
import type { ParsedUserAgent } from '../utils/parse-user-agent';
import type { ParsedUTMParams } from '../utils/parse-utm-params';
import type { Middleware, MiddlewareContext } from './middleware';
import { isbot } from 'isbot';
import { getCountryCodeByTimezone } from '../utils/get-country-code-by-timezone';
import { isValidUrl } from '../utils/is-valid-url';
import { parseAcceptLanguage } from '../utils/parse-accept-language';
import { parseReferrer } from '../utils/parse-referrer';
import { parseUserAgent } from '../utils/parse-user-agent';
import { parseUTMParams } from '../utils/parse-utm-params';
import { applyMiddleware } from './middleware';

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
export interface EventHandlerLoadRequestBody {
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
   * The timezone of the user. Optional.
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
export interface EventHandlerUnloadRequestBody {
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
export type EventHandlerLoadResult = EventData;

/**
 * The unload event result.
 */
export type EventHandlerUnloadResult = Pick<EventData, 'bid'> & {
  durationMs: NonNullable<EventData['durationMs']>;
};

/**
 * Overridable parser functions. Each parser falls back to the built-in
 * implementation when not provided.
 */
export interface EventHandlerParsers {
  userAgent?: (ua: string) => ParsedUserAgent;
  referrer?: (referrerUrl: string, currentUrl: string) => ParsedReferrer;
  acceptLanguage?: (header: string) => ParsedAcceptLanguage;
  utm?: (url: URL) => ParsedUTMParams;
}

/**
 * Options to configure the `EventHandler`.
 */
export type EventHandlerOptions<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> = {
  /**
   * Persists the `EventHandlerLoadResult` data.
   * @param data The `EventHandlerLoadResult` data.
   * @returns Void or promise of void.
   */
  persist: (
    data: EventHandlerLoadResult & { properties: TProperties | null },
  ) => MaybePromise<void>;

  /**
   * Updates the persisted data with the `EventHandlerUnloadResult` data.
   * @param data The `EventHandlerUnloadResult` data.
   * @returns Void or promise of void.
   */
  update: (data: EventHandlerUnloadResult) => MaybePromise<void>;

  /**
   * Optional logger for debugging. Defaults to `console`.
   */
  logger?: Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;

  /**
   * An ordered list of middleware functions. Each middleware can inspect,
   * transform, or abort events before they are persisted.
   */
  middlewares?: Middleware[];

  /**
   * Overridable parser functions. When not provided the built-in parsers
   * are used. Supply custom parsers to enrich, replace, or skip parsing
   * for specific fields.
   */
  parsers?: EventHandlerParsers;

  /**
   * Determines whether a user-agent should be treated as a bot.
   * Receives the raw user-agent string and returns `true` to skip
   * processing. Defaults to `isbot` from the `isbot` package.
   */
  shouldIgnoreUserAgent?: (ua: string) => boolean;
};

/**
 * Options to configure the `EventHandler` `track` method.
 */
export type EventHandlerTrackOptions = {
  /**
   * A function that returns the request body.
   * @returns The request body.
   */
  getRequestBody: () =>
    | MaybePromise<EventHandlerLoadRequestBody>
    | MaybePromise<EventHandlerUnloadRequestBody>;

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
export type EventHandlerTrackPayload = {
  /**
   * The request body.
   */
  requestBody: EventHandlerLoadRequestBody | EventHandlerUnloadRequestBody;

  /**
   * The request headers.
   */
  requestHeaders: Record<string, string | null | undefined>;
};

export class EventHandler<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> {
  private options: EventHandlerOptions<TProperties>;

  constructor(options: EventHandlerOptions<TProperties>) {
    this.options = options;
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    const logger = this.options.logger ?? console;
    logger[level](`[litetics:event] ${message}`);
  }

  private parseUrl(pageUrl: string): { host: string; path: string; queryString: string | null } {
    const url = new URL(pageUrl);
    return {
      host: url.hostname,
      path: url.pathname === '/' ? url.pathname : url.pathname.replace(/\/$/, ''),
      queryString: url.searchParams.toString() || null,
    };
  }

  async track(request: Request): Promise<void>;
  async track(options: EventHandlerTrackOptions): Promise<void>;
  async track(payload: EventHandlerTrackPayload): Promise<void>;
  async track(arg: Request | EventHandlerTrackOptions | EventHandlerTrackPayload): Promise<void> {
    const getRequestBody =
      arg instanceof Request
        ? () => arg.json().catch(() => arg.text())
        : 'requestBody' in arg
          ? () => arg.requestBody
          : arg.getRequestBody;

    const getRequestHeader =
      arg instanceof Request
        ? (name: string) => arg.headers.get(name)
        : 'requestHeaders' in arg
          ? (name: string) => arg.requestHeaders[name]
          : arg.getRequestHeader;

    const acceptLanguage = (await getRequestHeader('accept-language')) || null;
    const userAgent = (await getRequestHeader('user-agent')) || null;

    if (userAgent && (this.options.shouldIgnoreUserAgent ?? isbot)(userAgent)) {
      this.log('debug', 'User agent is a bot');
      return;
    }

    let body = await getRequestBody();
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        this.log('error', 'Failed to parse body as JSON');
        return;
      }
    }

    const eventType = body.e;
    const headers: Record<string, string | null | undefined> = {
      'accept-language': acceptLanguage,
      'user-agent': userAgent,
    };

    const runMiddleware = async (data: Partial<EventData>): Promise<boolean> => {
      if (!this.options.middlewares?.length) return true;
      const ctx: MiddlewareContext = {
        event: body,
        headers,
        data,
        aborted: false,
        abort() {
          this.aborted = true;
        },
      };
      await applyMiddleware(this.options.middlewares, ctx);
      return !ctx.aborted;
    };

    switch (eventType) {
      case 'load': {
        if (!body.u) return;
        if (!isValidUrl(body.u)) return;
        if (body.r && !isValidUrl(body.r)) {
          body.r = undefined;
        }

        const {
          b: bid,
          u: pageUrl,
          p: isUniqueUser,
          q: isUniquePage,
          a: type,
          r: referrer = null,
          t: timezone = null,
          d: properties = null,
        } = body;

        const receivedAt = new Date();
        const country = timezone ? getCountryCodeByTimezone(timezone) : null;

        const { host, path, queryString } = this.parseUrl(pageUrl);
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
          isUniqueUser,
          isUniquePage,
          type,
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
          utmTerm,
          utmContent,
          utmId,
          utmSourcePlatform,
          properties,
        };

        if (!(await runMiddleware(data))) return;
        await this.options.persist(
          data as EventHandlerLoadResult & { properties: TProperties | null },
        );
        break;
      }

      case 'unload': {
        const { b: bid, m: durationMs } = body;
        const data: Pick<EventData, 'bid'> & { durationMs: number } = { bid, durationMs };

        if (!(await runMiddleware(data))) return;
        await this.options.update(data);
        break;
      }

      default: {
        this.log('debug', `Unknown event received: ${eventType}`);
      }
    }
  }
}

export function createEventHandler<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
>(options: EventHandlerOptions<TProperties>): EventHandler<TProperties> {
  return new EventHandler(options);
}
