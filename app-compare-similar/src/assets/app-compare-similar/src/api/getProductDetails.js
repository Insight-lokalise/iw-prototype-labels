import axios, { POST } from './axios'
import { getSessionUser } from '../api/getSessionUser'
import { addFieldsForHybridX } from 'app-api-user-service'

/** Get Product Details API
 *
 * Get product details using the provided options
 * @param {string} locale - User locale
 * @param {string} materialId - Unique product id
 * @param {string} salesOrg
 * @param {boolean=} includeSpecifications
 */
export const getProductDetails = async ({
  locale,
  materialId,
  salesOrg,
  includeSpecifications = false,
  includeVariants = false,
}) => {
  try {
    const { userInformation, isLoggedIn } = await getSessionUser()
    const {
      webLoginProfileId: userId,
      currencyCode,
      account: { soldToId: soldTo } = {},
      webGroup: { webGroupId } = {},
      UserType: userType,
      isCES,
    } = userInformation || {}
    const params = {}

    await addFieldsForHybridX({isLoggedIn, isCES}, params, {userId, userType})

    const { data } = await axios({
      method: POST,
      url: '/gapi/product-management/product',
      data: {
        locale,
        materialId: decodeURIComponent(materialId),
        salesOrg,
        includeSpecifications,
        includeVariants,
        soldTo,
        webGroup: webGroupId,
        currencyCode,
        ...params
      },
    })
    if (!data.product) console.warn('There is no matched product found')
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch product details`, err)
    throw err
  }
}

export default getProductDetails
