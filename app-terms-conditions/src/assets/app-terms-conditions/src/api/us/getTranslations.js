import { i18n, t, getCurrentLocale } from '@insight/toolkit-utils'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'

export function getTranslations() {
  const locale = getCurrentLocale('insight_current_locale', 'insight_locale')
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite
  return i18n({ app: 'app-terms-conditions', isDebranded, locale }).then(
    (labels) => setToolkitLabels(labels)
  )
}

export default t
