export interface ParsedAcceptLanguage {
  languageCode: string | null;
  languageScript: string | null;
  languageRegion: string | null;
  secondaryLanguageCode: string | null;
  secondaryLanguageScript: string | null;
  secondaryLanguageRegion: string | null;
}

interface LanguageTag {
  code: string;
  region: string | null;
  script: string | null;
  quality: number;
}

export function parseAcceptLanguage(acceptLanguage: string): ParsedAcceptLanguage {
  if (!acceptLanguage) {
    return {
      languageCode: null,
      languageScript: null,
      languageRegion: null,
      secondaryLanguageCode: null,
      secondaryLanguageScript: null,
      secondaryLanguageRegion: null,
    };
  }

  const tags: LanguageTag[] = [];

  for (const lang of acceptLanguage.split(',')) {
    const parts = lang.trim().split(';');
    const [codeRegionScript] = parts;

    const codeRegionScriptParts = codeRegionScript.split('-');
    const code = codeRegionScriptParts[0];
    let script: string | null = null;
    let region: string | null = null;
    const quality = parts[1] ? Number.parseFloat(parts[1].split('=')[1]) : 1;

    if (codeRegionScriptParts.length === 3) {
      [script, region] = codeRegionScriptParts.slice(1);
    } else if (codeRegionScriptParts.length === 2) {
      if (codeRegionScriptParts[1].length === 4) {
        script = codeRegionScriptParts[1];
      } else {
        region = codeRegionScriptParts[1];
      }
    }

    const isValidCode = /^[A-Za-z]{2,3}$/.test(code) || code === '*';
    const isValidRegion = !region || /^[A-Za-z]{2}$/.test(region);
    const isValidScript = !script || /^[A-Za-z]{4}$/.test(script);
    if (!isValidCode || !isValidRegion || !isValidScript) {
      continue;
    }

    tags.push({ code, region, script, quality });
  }

  tags.sort((a, b) => b.quality - a.quality);

  return {
    languageCode: tags[0]?.code || null,
    languageScript: tags[0]?.script || null,
    languageRegion: tags[0]?.region || null,
    secondaryLanguageCode: tags[1]?.code || null,
    secondaryLanguageScript: tags[1]?.script || null,
    secondaryLanguageRegion: tags[1]?.region || null,
  };
}
