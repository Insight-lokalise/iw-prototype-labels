import { getCookie } from '../common/cookieHelpers'

export default function getBuyURL() {
  const locale = getCookie('insight_locale') || 'en_US'
  return `/${locale}/buy.html`
}
