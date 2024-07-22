export const parseUTMParams = (url: URL) => {
  const urlParams = new URLSearchParams(url.search)
  const source = urlParams.get('utm_source')
  const medium = urlParams.get('utm_medium')
  const campaign = urlParams.get('utm_campaign')

  return {
    source,
    medium,
    campaign
  }
}