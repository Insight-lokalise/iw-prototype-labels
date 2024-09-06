import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { INSIGHT_LOCALE_COOKIE_NAME } from './locales'

export default function getCreateAccountRoute(nextPageToBeDisplayed = true) {
  //landing page locale use domain cookie
  const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const APAC_LOCALES = ['en_AU', 'en_HK', 'en_NZ', 'en_SG', 'en_CN', 'zh_CN']
  const isAPAC = APAC_LOCALES.includes(locale)
  const apacUrl = `/${locale}/help/create-account.html`
  const nonApacUrl = nextPageToBeDisplayed ? `/insightweb/endUser/createAccount?nextPageToBeDisplayed=true` : "/insightweb/endUser/createAccount"
  return isAPAC ? apacUrl : nonApacUrl
}
