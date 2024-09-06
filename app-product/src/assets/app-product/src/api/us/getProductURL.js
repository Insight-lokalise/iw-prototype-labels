import { getCookie } from '../common/cookieHelpers'

export default function getProductURL(product) {
  const locale = getCookie('insight_locale') || 'en_US'
  return `/${locale}/product?id=${product.insightNumber}`
}
