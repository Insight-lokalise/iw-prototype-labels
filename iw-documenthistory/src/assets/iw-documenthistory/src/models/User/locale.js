import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

export function currentLocale() {
    return getCurrentLocale("insight_current_locale", "insight_locale")
}
