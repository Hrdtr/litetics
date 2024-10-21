/**
 * An object representing the parsed UTM parameters from a URL.
 */
export interface ParsedUTMParams {
  /**
   * The value of the `utm_source` parameter, or `null` if not present.
   */
  source: string | null

  /**
   * The value of the `utm_medium` parameter, or `null` if not present.
   */
  medium: string | null

  /**
   * The value of the `utm_campaign` parameter, or `null` if not present.
   */
  campaign: string | null
}

/**
 * Parses the URL and extracts the values of the `utm_source`, `utm_medium`, and `utm_campaign` parameters.
 *
 * @param {URL} url - The URL to parse.
 * @return {ParsedUTMParams} An object containing the extracted values of the `utm_source`, `utm_medium`, and `utm_campaign` parameters.
 */
export const parseUTMParams = (url: URL): ParsedUTMParams => {
  const urlParams = new URLSearchParams(url.search)
  const source = urlParams.get('utm_source')
  const medium = urlParams.get('utm_medium')
  const campaign = urlParams.get('utm_campaign')

  return {
    source,
    medium,
    campaign,
  }
}
