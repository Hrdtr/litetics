import type { EventData } from '../../../src/types';
import { createEventRequestHandler, createPingRequestHandler } from '../../../src';

export const events: EventData[] = [];

export const eventHandler = createEventRequestHandler({
  persist: (data) => {
    events.push(data);
  },
  update: ({ bid, durationMs }) => {
    const event = events.find((e) => e.bid === bid);
    if (event) {
      event.durationMs = durationMs;
    }
  },
  debug: true,
});

export const pingHandler = createPingRequestHandler({ debug: true });
