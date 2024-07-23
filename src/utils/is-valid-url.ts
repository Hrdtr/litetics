/**
 * Validates if the input string is a valid URL based on the specified protocols.
 *
 * @param {string} string - The input string to validate as a URL.
 * @param {{ matchProtocols?: string | string[] }} [options] - Optional object specifying protocols to match against.
 * @returns {boolean} True if the input string is a valid URL based on the specified protocols, false otherwise.
 */
export const isValidUrl = (string: string, options?: { matchProtocols?: string | string[] }): boolean => {
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
