import { UAParser } from 'my-ua-parser'

/**
 * An object containing parsed browser, device, CPU, engine, operating system information,
 * and the original user agent string.
 */
export interface ParsedUserAgent {
  /**
   * The parsed browser information.
   */
  browser: UAParser.IBrowser
  /**
   * The parsed browser engine information.
   */
  browserEngine: UAParser.IEngine
  /**
   * The parsed device information.
   */
  device: UAParser.IDevice
  /**
   * The parsed CPU information.
   */
  cpu: UAParser.ICPU
  /**
   * The parsed operating system information.
   */
  os: UAParser.IOS
}

/**
 * Parses the user agent string to extract browser, device, CPU, engine, and operating system information.
 *
 * @param {string} uaString - The user agent string to parse.
 * @return {ParsedUserAgent} An object containing parsed browser, device, CPU, engine, operating system information, and the original user agent string.
 */
export const parseUserAgent = (uaString: string): ParsedUserAgent => {
  const {
    browser,
    engine,
    device,
    cpu,
    os,
  } = new UAParser(uaString).getResult()

  return {
    browser,
    browserEngine: engine,
    device,
    cpu,
    os,
  }
}

export type Device = {
  userAgent: string
  isDesktop: boolean
  isIos: boolean
  isAndroid: boolean
  isMobile: boolean
  isMobileOrTablet: boolean
  isDesktopOrTablet: boolean
  isTablet: boolean
  isLinux: boolean
  isWindows: boolean
  isMacOS: boolean
  isApple: boolean
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isChrome: boolean
  isSamsung: boolean
  isCrawler: boolean
}
