import { i18n , t, getCurrentLocale } from '@insight/toolkit-utils'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME  } from '../common/locales'

export function getTranslations(headerInfo) {
  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const isDebranded = window && window.Insight && window.Insight.b2bLoginInfo && window.Insight.b2bLoginInfo.debrandSite
  
  i18n({ app: 'app-header', isDebranded, locale })
  return headerInfo
}

export default t;
