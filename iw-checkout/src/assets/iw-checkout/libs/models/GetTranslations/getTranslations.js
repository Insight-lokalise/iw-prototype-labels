import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { fetchLabels } from '@insight/toolkit-utils/lib/labels'

export default function getTranslations() {
    const locale = getCurrentLocale("insight_current_locale", "insight_locale")
    const isDebranded = window && window.Insight && window.Insight.b2bLoginInfo && window.Insight.b2bLoginInfo.debrandSite
    return fetchLabels({ labelFileName: "app-checkout", app: 'iw-checkout', isDebranded, locale })
}
