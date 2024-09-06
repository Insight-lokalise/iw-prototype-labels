import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

export function getLocaleFromCookie() {
  return getCurrentLocale("insight_current_locale", "insight_locale")
}
