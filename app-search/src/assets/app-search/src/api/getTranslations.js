import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { fetchLabels, getCurrentLocale } from '@insight/toolkit-utils'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../constants'

export function getTranslations(headerInfo) {
  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite

  return fetchLabels({ labelFileName: 'app-search', app: 'app-search', isDebranded, locale }).then((labels) => {
    setToolkitLabels(labels)
    return headerInfo
  })
}

