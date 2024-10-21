export type EventData = {
  /**
   * The beacon ID.
   */
  bid: string
  /**
   * The time at which the event was received.
   */
  receivedAt: Date
  /**
   * The hostname of the page.
   */
  host: string
  /**
   * The path of the page.
   */
  path: string
  /**
   * The query string of the page.
   */
  queryString: string | null
  /**
   * Flag indicating if the user is unique.
   */
  isUniqueUser: boolean
  /**
   * Flag indicating if this is the first time the user has visited this specific page.
   */
  isUniquePage: boolean
  /**
   * The type of event.
   */
  type: 'pageview' | (string & { _?: never })

  // optional fields
  /**
   * The duration of the event in milliseconds.
   */
  durationMs: number | null
  /**
   * The timezone of the user.
   */
  timezone: string | null
  /**
   * The country of the user.
   */
  country: string | null
  /**
   * The user-agent string.
   */
  userAgent: string | null
  /**
   * The name of the browser.
   */
  browserName: string | null
  /**
   * The version of the browser.
   */
  browserVersion: string | null
  /**
   * The name of the browser engine.
   */
  browserEngineName: string | null
  /**
   * The version of the browser engine.
   */
  browserEngineVersion: string | null
  /**
   * The type of device.
   */
  deviceType: string | null
  /**
   * The vendor of the device.
   */
  deviceVendor: string | null
  /**
   * The model of the device.
   */
  deviceModel: string | null
  /**
   * The architecture of the CPU.
   */
  cpuArchitecture: string | null
  /**
   * The name of the operating system.
   */
  osName: string | null
  /**
   * The version of the operating system.
   */
  osVersion: string | null
  /**
   * The raw referer header.
   */
  referrer: string | null
  /**
   * The hostname of the referer.
   */
  referrerHost: string | null
  /**
   * The path of the referer.
   */
  referrerPath: string | null
  /**
   * The query string of the referer.
   */
  referrerQueryString: string | null
  /**
   * Whether the referer is known or not.
   */
  referrerKnown: boolean | null
  /**
   * The medium of the referer.
   */
  referrerMedium: string | null
  /**
   * The name of the referer.
   */
  referrerName: string | null
  /**
   * The search parameter of the referer.
   */
  referrerSearchParameter: string | null
  /**
   * The search term of the referer.
   */
  referrerSearchTerm: string | null
  /**
   * The raw accept-language header.
   */
  acceptLanguage: string | null
  /**
   * The code of the language.
   */
  languageCode: string | null
  /**
   * The script of the language.
   */
  languageScript: string | null
  /**
   * The region of the language.
   */
  languageRegion: string | null
  /**
   * The code of the secondary language.
   */
  secondaryLanguageCode: string | null
  /**
   * The script of the secondary language.
   */
  secondaryLanguageScript: string | null
  /**
   * The region of the secondary language.
   */
  secondaryLanguageRegion: string | null
  /**
   * The campaign of the UTM parameter.
   */
  utmCampaign: string | null
  /**
   * The medium of the UTM parameter.
   */
  utmMedium: string | null
  /**
   * The source of the UTM parameter.
   */
  utmSource: string | null
  /**
   * Custom event data.
   */
  additional: {
    [key: string]: string | number | boolean | null | undefined
  } | null
}
