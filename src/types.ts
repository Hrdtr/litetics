export type EventData = {
  bid: string,
  hostname: string,
  pathname: string,
  isUniqueUser: boolean,
  isUniquePage: boolean,
  // optional fields
  durationMs: number | null,
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
  referrerKnown: boolean | null,
  referrerMedium: string | null,
  referrerName: string | null,
  referrerSearchParameter: string | null,
  referrerSearchTerm: string | null,
  country: string | null,
  languageCode: string | null,
  languageScript: string | null,
  languageRegion: string | null,
  utmCampaign: string | null,
  utmMedium: string | null,
  utmSource: string | null,
  additional: {
    [key: string]: string | number | boolean | null | undefined
  } | null
}

