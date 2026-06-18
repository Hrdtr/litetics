import { createPingResponse } from '../../../src';
import { pingHandler } from '../utils/litetics';

export default defineEventHandler(async (event) => {
  const result = await pingHandler.handle({
    getRequestHeader: (name) => getHeader(event, name) ?? null,
  });
  return createPingResponse(result);
});
