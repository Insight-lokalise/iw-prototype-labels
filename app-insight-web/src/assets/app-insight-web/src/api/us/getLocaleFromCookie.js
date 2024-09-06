import { getCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
//landing page locale so use existing domain cookie
export default function getLocaleFromCookie() {
  return getCookie('insight_locale')
}
