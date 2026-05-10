import type { EventData } from '../../../src/types';
import { createLitetics } from '../../../src';

export const events: EventData[] = [];

export const { handleEventRequest, handlePingRequest } = createLitetics({
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
