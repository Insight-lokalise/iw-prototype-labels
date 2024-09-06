import { getCookie, PDP_LOCALE_COOKIE_NAME } from './cookieHelpers'

/**
 * Builds a URL for the product details page of a passed in item. Mostly just
 * concatenates some properties.
 * Based on `CommonUtil.productdetailURLMap`
 * @param  {Object} {
 *         locale
 *         materialId
 *         mfrName
 *         mfrId
 *         description
 * }                                        Required product information to build the URL
 * @return {String}                         A URL to the product details page of the passed in item.
 */

export function makeProductDetailURL({
  //PDP urls will use domain cookie for now till we decide what to do with EMEA
  locale = getCookie(PDP_LOCALE_COOKIE_NAME) || 'en_US',
  materialId,
  manufacturerName,
  manufacturerPartNumber,
  description,
}) {
  const productDescription = description
    .replace(/[\.,-\/#!$%\"\'\^&\*;:{}=\-_`~()]/g, '')
    .trim()
    .replace(/ +(?= )/g, '')
    .replace(/\s/g, '-')
  return `../../${locale}/shop/product/${encodeURIComponent(materialId)}/${encodeURIComponent(manufacturerName)}/${encodeURIComponent(manufacturerPartNumber)}/${productDescription}/`
}
