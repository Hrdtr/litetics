export const isValidUrl = (string: string, options?: { matchProtocols?: string | string[] }) => {
  try {
    const url = new URL(string)
    if (options?.matchProtocols) {
      const matchProtocols = Array.isArray(options.matchProtocols) ? options.matchProtocols : [options.matchProtocols]
      return matchProtocols.includes(url.protocol)
    }
    return true
  }
  catch {
    return false
  }
}
