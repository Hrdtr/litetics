import { consola } from 'consola'

const log = consola.withTag('litetics:ping')

/**
 * Represents the result of a ping request.
 */
export type PingResult = {
  /**
   * The data which should be returned by the server. Can be '0', '1', or null.
   */
  data: '0' | '1' | null,
  /**
   * An error message, if applicable.
   */
  error?: string,
  /**
   * The HTTP status code of the response.
   */
  status: number
}

/**
 * Async function that handles the ping request, checks the if-modified-since header,
 * and returns the appropriate response based on the header value.
 *
 * @param {(name: string) => string | undefined} getRequestHeader - Function to get the request header value.
 * @param {(name: string, value: string) => void} setResponseHeader - Function to set the response header.
 * @return {Promise<PingResult>} Promise that resolves to the PingResult object.
 */
export const ping = async (
  getRequestHeader: (name: string) => string | undefined,
  setResponseHeader: (name: string, value: string) => void,
): Promise<PingResult> => {
  // Retrieve the 'if-modified-since' header from the request
  const ifModified = getRequestHeader('if-modified-since')
  // Get the current day with time set to 00:00:00.000
  const currentDay = new Date().setHours(0, 0, 0, 0)

  if (!ifModified) {
    // Get the current day with time set to 00:00:00.000
    setResponseHeader('Last-Modified', new Date(currentDay).toUTCString())
    setResponseHeader('Cache-Control', 'no-cache')
    // Return a response indicating the user is new for the day
    return {
      data: '0',
      status: 200
    }
  }

  const lastModifiedDate = new Date(ifModified)
  const lastModifiedTime = lastModifiedDate.getTime()

  // If the date is invalid
  if (Number.isNaN(lastModifiedTime) || lastModifiedDate.toUTCString() === 'Invalid Date') {
    log.error('Failed to parse if-modified-since header')
    return {
      data: null,
      status: 400,
      error: 'Bad Request',
    }
  }
  // If the date is in the future
  if (lastModifiedTime > Date.now()) {
    log.error('if-modified-since header is a future date')
    return {
      data: null,
      status: 400,
      error: 'Bad Request',
    }
  }

  // If the date is earlier than the current day
  if (lastModifiedTime < currentDay) {
    // Set 'Last-Modified' header to the start of the current day
    setResponseHeader('Last-Modified', new Date(currentDay).toUTCString())
    setResponseHeader('Cache-Control', 'no-cache')
    // Return a response indicating the user is new for the day
    return {
      data: '0',
      status: 200
    }
  }

  // If the date is today
  setResponseHeader('Last-Modified', ifModified)
  setResponseHeader('Cache-Control', 'no-cache')
  // Return a response indicating the user is not new for the day
  return {
    data: '1',
    status: 200
  }
}