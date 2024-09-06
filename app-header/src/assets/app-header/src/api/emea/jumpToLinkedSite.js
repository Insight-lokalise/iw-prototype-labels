const SELECT_SITE_URL = '/apps/account/index.php?a=selectsite'

export default function jumpToLinkedSite({username, siteId, languageSuffix}) {
  window.location = languageSuffix
    ? `${window.siteHrefCurrentBaseNoLang}/${languageSuffix}${SELECT_SITE_URL}&site_id=${siteId}`
    : `${window.siteHrefCurrentBase}${SELECT_SITE_URL}&site_id=${siteId}`
}
