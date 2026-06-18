import type { Primitive } from '../types';
import type { EventRequestHandlerOptions } from './event';
import { EventRequestHandler } from './event';
import { PingRequestHandler } from './ping';

export type {
  EventRequestHandlerLoadRequestBody,
  EventRequestHandlerLoadResult,
  EventRequestHandlerOptions,
  EventRequestHandlerParsers,
  EventRequestHandlerTrackOptions,
  EventRequestHandlerTrackPayload,
  EventRequestHandlerUnloadRequestBody,
  EventRequestHandlerUnloadResult,
} from './event';
export type {
  PingRequestHandlerOptions,
  PingRequestHandlerPayload,
  PingRequestHandlerHandleOptions,
  PingRequestHandlerResult,
} from './ping';

export { EventRequestHandler, createEventRequestHandler } from './event';
export { PingRequestHandler, createPingRequestHandler, createPingResponse } from './ping';

export type LiteticsOptions<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> = EventRequestHandlerOptions<TProperties>;

export class Litetics<TProperties extends Record<string, Primitive> = Record<string, Primitive>> {
  handleEventRequest: EventRequestHandler<TProperties>['track'];
  handlePingRequest: PingRequestHandler['handle'];

  constructor(options: LiteticsOptions<TProperties>) {
    const eventRequestHandler = new EventRequestHandler(options);
    const pingRequestHandler = new PingRequestHandler({ debug: options.debug });

    this.handleEventRequest = eventRequestHandler.track.bind(eventRequestHandler);
    this.handlePingRequest = pingRequestHandler.handle.bind(pingRequestHandler);
  }
}

export function createLitetics<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
>(options: LiteticsOptions<TProperties>): Litetics<TProperties> {
  return new Litetics(options);
}
