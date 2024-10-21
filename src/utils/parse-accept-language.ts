/**
 * Interface representing a language tag.
 */
export interface ParsedAcceptLanguage {
  /** The language code. */
  code: string
  /** The region code. */
  region: string | null
  /** The script code. */
  script: string | null
  /** The quality of the language tag. */
  quality: number
}

/**
 * Parses the accept language header string and returns an array of language tags sorted by quality.
 *
 * @param {string} acceptLanguage - The accept language header string to parse.
 * @return {ParsedAcceptLanguage[]} An array of language tags sorted by quality.
 */
export function parseAcceptLanguage(acceptLanguage: string): ParsedAcceptLanguage[] {
  if (!acceptLanguage) return []

  return acceptLanguage.split(',').map((lang) => {
    // Split the language tag by semicolon and get the code, region, and script
    const parts = lang.trim().split(';')
    const [codeRegionScript] = parts

    const codeRegionScriptParts = codeRegionScript.split('-')
    const code = codeRegionScriptParts[0]
    let script = null
    let region = null
    const quality = parts[1] ? Number.parseFloat(parts[1].split('=')[1]) : 1

    // Check if the language tag has region and script
    if (codeRegionScriptParts.length === 3) {
      [script, region] = codeRegionScriptParts.slice(1)
    }
    else if (codeRegionScriptParts.length === 2) {
      if (codeRegionScriptParts[1].length === 4) {
        script = codeRegionScriptParts[1]
      }
      else {
        region = codeRegionScriptParts[1]
      }
    }

    // Ensure code is valid
    if (!/^[A-Za-z]{2,3}$/.test(code) && (code !== '*'
      || (region && !/^[A-Za-z]{2}$/.test(region))
      || (script && !/^[A-Za-z]{4}$/.test(script)))) {
      return null
    }

    return { code, region, script, quality }
  })
    // Filter out invalid tags and sort tags by quality in descending order
    .filter((tag): tag is ParsedAcceptLanguage => !!tag)
    .sort((a, b) => b.quality - a.quality)
}
