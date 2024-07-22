import { UAParser } from "ua-parser-js"

export const parseUserAgent = (uaString: string) => {
  const {
    browser,
    device,
    cpu,
    engine,
    os,
  } = new UAParser(uaString).getResult()
  
  return {
    browser,
    device,
    cpu,
    engine,
    os,
    _src: uaString,
  }
}
