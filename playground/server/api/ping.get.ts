import { createPingResponse } from '../../../src';
import { handlePingRequest } from '../utils/litetics';

export default defineEventHandler(async (event) => {
  const result = await handlePingRequest({
    getRequestHeader: (name) => getHeader(event, name) ?? null,
  });
  return createPingResponse(result);
});
