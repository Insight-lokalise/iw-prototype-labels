import { currentLocale } from './../User/locale'
import axios, { POST } from '../../../app/libs/axiosConfig'
import { DEFAULT_IMAGE } from '../../../app/libs/constants'

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
  locale = currentLocale(),
  materialId = required(),
  mfrName = required(),
  mfrId = required(),
  description = required(),
}) {
  description = description
    .replace(/[\.,-\/#!$%\"\'\^&\*;:{}=\-_`~()]/g, '')
    .trim()
    .replace(/ +(?= )/g, '')
    .replace(/\s/g, '-')

  return `/${locale}/shop/product/${encodeURIComponent(
    materialId
  )}/${encodeURIComponent(mfrName)}/${encodeURIComponent(
    mfrId
  )}/${description}/`
}

/**
 * Simply throws an error on invokation. Useful for marking parameters as required.
 * Could do some currying for more descriptive Errors. Would be good.
 * @return {Error}
 */
function required() {
  throw Error('Function missing necessary argument')
}

export function productImageToRender(image) {
  function isValidImage(value) {
    return !!value && value !== 'image.not.available'
  }
  if (!image) {
    return DEFAULT_IMAGE
  } else if (isValidImage(image.extraLargeImage)) {
    return image.extraLargeImage
  } else if (isValidImage(image.largeImage)) {
    return image.largeImage
  } else if (isValidImage(image.smallImage)) {
    return image.smallImage
  } else if (isValidImage(image.manufacturerExtraLargeImage)) {
    return image.manufacturerExtraLargeImage
  } else if (isValidImage(image.manufacturerLargeImage)) {
    return image.manufacturerLargeImage
  } else if (isValidImage(image.manufacturerSmallImage)) {
    return image.manufacturerSmallImage
  } else {
    return DEFAULT_IMAGE
  }
}

/** Get Product Details API
 *
 * Get product details using the provided options
 * @param {string} locale - User locale
 * @param {string} materialId - Unique product id
 * @param {string} salesOrg
 * @param {boolean=} includeSpecifications
 */
export const getProductDetails = async (parentWebProduct) => {
  try {
    const {
      materialID: materialId,
      salesOrg,
      soldto: soldTo,
      currencyCode,
      wg: webGroupId,
    } = parentWebProduct
    const locale = currentLocale()
    const isLoggedIn = window?.Insight?.isLoggedin
    const body = {
      locale,
      materialId: decodeURIComponent(materialId),
      salesOrg,
      includeSpecifications: false,
      includeVariants: false,
      soldTo,
      currencyCode,
      ...(isLoggedIn &&
        soldTo &&
        webGroupId && {
          soldTo: soldTo,
          webGroup: webGroupId,
        }),
    }

    return axios({
      method: POST,
      url: '/gapi/product-management/product',
      data: body,
    }).then((response) => response?.data)
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch product details`, err)
    throw err
  }
}
