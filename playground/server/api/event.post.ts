import { handleEventRequest } from '../utils/litetics';

export default defineEventHandler(async (event) => {
  await handleEventRequest({
    getRequestBody: () => readBody(event),
    getRequestHeader: (name) => getHeader(event, name) ?? null,
  });
  setResponseStatus(event, 204);
  return null;
});
