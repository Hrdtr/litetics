import type { EventData, MaybePromise } from '../types';
import type { EventHandlerLoadRequestBody, EventHandlerUnloadRequestBody } from './event';

/**
 * Context passed to each middleware function.
 * Middleware can read the raw event and headers, modify the parsed data,
 * or abort processing entirely.
 */
export interface MiddlewareContext {
  /**
   * The raw request body received from the tracker.
   */
  event: EventHandlerLoadRequestBody | EventHandlerUnloadRequestBody;

  /**
   * The request headers relevant to this event.
   */
  headers: Record<string, string | null | undefined>;

  /**
   * The parsed event data that will be persisted.
   * Middleware can mutate this object to enrich, transform, or redact fields.
   */
  data: Partial<EventData>;

  /**
   * Whether a previous middleware has aborted processing.
   * Check this at the start of your middleware to skip work when
   * an earlier middleware already aborted.
   */
  aborted: boolean;

  /**
   * Call to abort event processing. The event will not be persisted.
   * Sets `aborted` to `true`.
   */
  abort: () => void;
}

/**
 * A middleware function that can inspect, transform, or abort an event.
 *
 * @param ctx - The middleware context with event data and control methods.
 * @returns Void or a promise of void.
 */
export type Middleware = (ctx: MiddlewareContext) => MaybePromise<void>;

/**
 * Runs an ordered chain of middleware functions against a context.
 *
 * @param middlewares - The middleware functions to run.
 * @param ctx - The context to pass to each middleware.
 */
export async function applyMiddleware(
  middlewares: Middleware[],
  ctx: MiddlewareContext,
): Promise<void> {
  for (const mw of middlewares) {
    if (ctx.aborted) return;
    await mw(ctx);
    if (ctx.aborted) return;
  }
}
