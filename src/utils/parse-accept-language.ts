export interface LanguageTag {
  code: string;
  region: string | null;
  script: string | null;
  quality: number;
}

export function parseAcceptLanguage(acceptLanguage: string): LanguageTag[] {
  if (!acceptLanguage) return [];

  const parsedTags = acceptLanguage.split(',').map(lang => {
    const parts = lang.trim().split(';');
    const [codeRegionScript] = parts;
    const quality = parts[1] ? Number.parseFloat(parts[1].split('=')[1]) : 1;

    const codeRegionScriptParts = codeRegionScript.split('-');
    const code = codeRegionScriptParts[0];
    let script = null;
    let region = null;

    if (codeRegionScriptParts.length === 3) {
      [script, region] = codeRegionScriptParts.slice(1);
    } else if (codeRegionScriptParts.length === 2) {
      if (codeRegionScriptParts[1].length === 4) {
        script = codeRegionScriptParts[1];
      } else {
        region = codeRegionScriptParts[1];
      }
    }

    // Ensure code is valid
    if (!/^[A-Za-z]{2,3}$/.test(code) && code !== '*' || 
        (region && !/^[A-Za-z]{2}$/.test(region)) ||
        (script && !/^[A-Za-z]{4}$/.test(script))) {
      return null;
    }

    return { code, region, script, quality };
  }).filter(Boolean) as LanguageTag[];

  // Sort valid tags by quality in descending order
  return parsedTags.sort((a, b) => b.quality - a.quality);
}