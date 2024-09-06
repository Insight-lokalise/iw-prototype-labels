import { hasCookie, getCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import { INSIGHT_LOCALE_COOKIE_NAME } from '../common/locales'

export default function getSearchURL(query,qsrc) {
  //use domain cookie for product url for EMEA
  const locale = hasCookie(INSIGHT_LOCALE_COOKIE_NAME) ? getCookie(INSIGHT_LOCALE_COOKIE_NAME) : 'en_US'
  return `/${locale}/search.html?qtype=all&q=${encodeURIComponent(query)}&qsrc=${qsrc}`
}
