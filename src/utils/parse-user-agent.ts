import { UAParser } from 'my-ua-parser';

export interface ParsedUserAgent {
  browserName: string | null;
  browserVersion: string | null;
  browserEngineName: string | null;
  browserEngineVersion: string | null;
  deviceType: string | null;
  deviceVendor: string | null;
  deviceModel: string | null;
  cpuArchitecture: string | null;
  osName: string | null;
  osVersion: string | null;
}

export const parseUserAgent = (uaString: string): ParsedUserAgent => {
  const { browser, engine, device, cpu, os } = new UAParser(uaString).getResult();

  return {
    browserName: browser.name || null,
    browserVersion: browser.version || null,
    browserEngineName: engine.name || null,
    browserEngineVersion: engine.version || null,
    deviceType: device.type || null,
    deviceVendor: device.vendor || null,
    deviceModel: device.model || null,
    cpuArchitecture: cpu.architecture || null,
    osName: os.name || null,
    osVersion: os.version || null,
  };
};
