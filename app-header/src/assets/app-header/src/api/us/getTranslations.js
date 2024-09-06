import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { i18n, t, getCurrentLocale, fetchLabels } from '@insight/toolkit-utils'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../common/locales'

export function getTranslations(headerInfo) {
  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite

  return fetchLabels({ labelFileName: "app-header", app: 'app-header', isDebranded, locale }).then((labels) => {
    setToolkitLabels(labels)
    return headerInfo
  })
}

export default t
