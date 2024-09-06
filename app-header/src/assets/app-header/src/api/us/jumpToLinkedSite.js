export default function jumpToLinkedSite({ locale, siteName, url }) {
  const isCiamEnabled =
    window.flags && window.flags['GNA-12439-CIAM-MIGRATION-PING-ONE-IDENTITY']

  const linkedSite = `/insightweb/sso/jump?target=${siteName}${
    locale ? `&targetLocale=${locale}` : ''
  }`
  window.location = isCiamEnabled ? url : linkedSite
}
