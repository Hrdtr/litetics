import { consola } from 'consola'

const log = consola.withTag('litetics:ping')

export type PingResult = {
  data: '0' | '1' | null,
  error?: string,
  status: number
}

export const ping = async (
  getRequestHeader: (name: string) => string | undefined,
  setResponseHeader: (name: string, value: string) => void,
): Promise<PingResult> => {
  const ifModified = getRequestHeader('if-modified-since')
  const currentDay = new Date().setHours(0, 0, 0, 0)

  if (!ifModified) {
    setResponseHeader('Last-Modified', new Date(currentDay).toUTCString())
    setResponseHeader('Cache-Control', 'no-cache')
    return {
      data: '0',
      status: 200
    }
  }

  const lastModifiedDate = new Date(ifModified)
  const lastModifiedTime = lastModifiedDate.getTime()

  if (Number.isNaN(lastModifiedTime) || lastModifiedDate.toUTCString() === 'Invalid Date') {
    log.error('Failed to parse if-modified-since header')
    return {
      data: null,
      status: 400,
      error: 'Bad Request',
    }
  }

  if (lastModifiedTime > Date.now()) {
    log.error('if-modified-since header is a future date')
    return {
      data: null,
      status: 400,
      error: 'Bad Request',
    }
  }

  if (lastModifiedTime < currentDay) {
    setResponseHeader('Last-Modified', new Date(currentDay).toUTCString())
    setResponseHeader('Cache-Control', 'no-cache')
    return {
      data: '0',
      status: 200
    }
  }

  setResponseHeader('Last-Modified', ifModified)
  setResponseHeader('Cache-Control', 'no-cache')
  return {
    data: '1',
    status: 200
  }
}