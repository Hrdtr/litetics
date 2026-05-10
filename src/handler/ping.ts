import type { MaybePromise } from '../types';

/**
 * Represents the result of a ping request.
 */
export type PingRequestHandlerResult = {
  /**
   * The HTTP status code of the response.
   */
  status: number;
  /**
   * The HTTP headers of the response.
   */
  headers: Record<string, string>;
  /**
   * The data which should be returned by the server. Can be '0', '1', or null.
   */
  body: '0' | '1' | null;
  /**
   * An error message, if applicable.
   */
  error?: string;
};

/**
 * Options to configure the `PingRequestHandler` `ping` method.
 */
export type PingRequestHandlerOptions = {
  /**
   * A function that returns the request header.
   * @param name The name of the header.
   * @returns The value of the header or `undefined` if not present.
   */
  getRequestHeader: (name: string) => MaybePromise<string | null | undefined>;
};

/**
 * The payload passed to the `ping` method.
 */
export type PingRequestHandlerPayload = {
  /**
   * The request headers.
   */
  requestHeaders: Record<string, string | null | undefined>;
};

export type PingRequestHandlerConstructorOptions = {
  /**
   * When true, logs debug information to console. Defaults to `false`.
   */
  debug?: boolean;
};

export class PingRequestHandler {
  private options: PingRequestHandlerConstructorOptions;

  constructor(options?: PingRequestHandlerConstructorOptions) {
    this.options = options ?? {};
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (!this.options.debug) return;
    console[level](`[litetics:ping] ${message}`);
  }

  async process(request: Request): Promise<PingRequestHandlerResult>;
  async process(options: PingRequestHandlerOptions): Promise<PingRequestHandlerResult>;
  async process(payload: PingRequestHandlerPayload): Promise<PingRequestHandlerResult>;
  async process(
    arg: Request | PingRequestHandlerOptions | PingRequestHandlerPayload,
  ): Promise<PingRequestHandlerResult> {
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

    const ifModifiedSince = await getRequestHeader('if-modified-since');
    const currentDay = new Date().setUTCHours(0, 0, 0, 0);

    if (!ifModifiedSince) {
      return {
        status: 200,
        headers: {
          'Last-Modified': new Date(currentDay).toUTCString(),
          'Cache-Control': 'no-cache',
        },
        body: '0',
        error: undefined,
      };
    }

    const lastModifiedDate = new Date(ifModifiedSince);
    const lastModifiedTime = lastModifiedDate.getTime();

    if (Number.isNaN(lastModifiedTime) || lastModifiedDate.toUTCString() === 'Invalid Date') {
      this.log('error', 'Failed to parse if-modified-since header');
      return {
        status: 400,
        headers: {},
        body: null,
        error: 'Bad Request',
      };
    }
    if (lastModifiedTime > Date.now()) {
      this.log('error', 'if-modified-since header is a future date');
      return {
        status: 400,
        headers: {},
        body: null,
        error: 'Bad Request',
      };
    }

    if (lastModifiedTime < currentDay) {
      return {
        status: 200,
        headers: {
          'Last-Modified': new Date(currentDay).toUTCString(),
          'Cache-Control': 'no-cache',
        },
        body: '0',
        error: undefined,
      };
    }

    // Align reset to next midnight so the unique visitor window always
    // matches calendar-day boundaries.
    const nextResetTime = currentDay + 24 * 60 * 60 * 1000;
    return {
      status: 200,
      headers: {
        'Last-Modified': ifModifiedSince,
        'Cache-Control': `max-age=${Math.ceil((nextResetTime - Date.now()) / 1000)}`,
      },
      body: '1',
      error: undefined,
    };
  }
}

export function createPingResponse(data: PingRequestHandlerResult): Response {
  return new Response(data.error ?? data.body, {
    status: data.status,
    headers: data.headers,
  });
}
