export type {
  EventRequestHandlerLoadRequestBody,
  EventRequestHandlerUnloadRequestBody,
  EventRequestHandlerLoadResult,
  EventRequestHandlerUnloadResult,
  EventRequestHandlerParsers,
  EventRequestHandlerOptions,
  EventRequestHandlerTrackOptions,
  EventRequestHandlerTrackPayload,
} from './event';
export type {
  PingRequestHandlerResult,
  PingRequestHandlerOptions,
  PingRequestHandlerPayload,
} from './ping';
export { createPingResponse } from './ping';

import type { Primitive } from '../types';
import type { EventRequestHandlerOptions } from './event';
import { EventRequestHandler } from './event';
import { PingRequestHandler } from './ping';

export type LiteticsOptions<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> = EventRequestHandlerOptions<TProperties>;

export class Litetics<TProperties extends Record<string, Primitive> = Record<string, Primitive>> {
  handleEventRequest: EventRequestHandler<TProperties>['track'];
  handlePingRequest: PingRequestHandler['process'];

  constructor(options: LiteticsOptions<TProperties>) {
    const eventRequestHandler = new EventRequestHandler(options);
    const pingRequestHandler = new PingRequestHandler({ debug: options.debug });

    this.handleEventRequest = eventRequestHandler.track.bind(eventRequestHandler);
    this.handlePingRequest = pingRequestHandler.process.bind(pingRequestHandler);
  }
}

export function createLitetics<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
>(options: LiteticsOptions<TProperties>): Litetics<TProperties> {
  return new Litetics(options);
}
