export interface ParsedUTMParams {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  id: string | null;
  sourcePlatform: string | null;
}

export const parseUTMParams = (url: URL): ParsedUTMParams => {
  const urlParams = new URLSearchParams(url.search);

  return {
    source: urlParams.get('utm_source'),
    medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('utm_campaign'),
    term: urlParams.get('utm_term'),
    content: urlParams.get('utm_content'),
    id: urlParams.get('utm_id'),
    sourcePlatform: urlParams.get('utm_source_platform'),
  };
};
