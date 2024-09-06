import getCookie from './cookieHelpers'

/* TODO - its done only for 1 contract, once checkbox is implemented need to pass all the selected contractID & programID */

export default function getSearchResultsURL(contractID, assortmentIds){
  //use domain cookie for product and landing pages
  const locale = getCookie('insight_locale') || 'en_US'
  return `/${locale}/search.html?qtype=all&licenseContractIds=${encodeURIComponent(contractID)}&fromLicense=true&assortmentIds=${encodeURIComponent(assortmentIds)}`
}
