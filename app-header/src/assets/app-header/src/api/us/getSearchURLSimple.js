import { hasCookie, getCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import { INSIGHT_LOCALE_COOKIE_NAME } from '../common/locales'

export default function getSearchURLSimple(query, categoryCode, isCategory, qsrc) {
  //use domain cookie for product url for EMEA
  const locale = hasCookie(INSIGHT_LOCALE_COOKIE_NAME) ? getCookie(INSIGHT_LOCALE_COOKIE_NAME) : 'en_US'
  return `/${locale}/search.html?q=${encodeURIComponent(query)}&qsrc=${qsrc}${isCategory ? '&category='+categoryCode : ''}`
}
