export type EventData = {
  bid: string,
  hostname: string,
  pathname: string,
  isUniqueUser: boolean,
  isUniquePage: boolean,
  type: 'pageview' | (string & { _?: never }),
  // optional fields
  durationMs: number | null,
  timezone: string | null,
  country: string | null,
  userAgent: string | null, // raw user-agent header
  browserName: string | null,
  browserVersion: string | null,
  browserEngineName: string | null,
  browserEngineVersion: string | null,
  deviceType: string | null,
  deviceVendor: string | null,
  deviceModel: string | null,
  cpuArchitecture: string | null,
  osName: string | null,
  osVersion: string | null,
  referrer: string | null, // raw referer header
  referrerHost: string | null,
  referrerPath: string | null,
  referrerQueryString: string | null,
  referrerKnown: string | null
  referrerMedium: string | null,
  referrerName: string | null,
  referrerSearchParameter: string | null,
  referrerSearchTerm: string | null,
  acceptLanguage: string | null, // raw accept-language header
  languageCode: string | null,
  languageScript: string | null,
  languageRegion: string | null,
  secondaryLanguageCode: string | null,
  secondaryLanguageScript: string | null,
  secondaryLanguageRegion: string | null,
  utmCampaign: string | null,
  utmMedium: string | null,
  utmSource: string | null,
  additional: {
    [key: string]: string | number | boolean | null | undefined
  } | null
}
