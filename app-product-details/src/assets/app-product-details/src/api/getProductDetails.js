import axios, { POST, GET } from './axios'
import { addFieldsForHybridX } from 'app-api-user-service'

let cachedProductDetailsResponse = {};
// caching product details, using material id as key
export const getProductDetailsCachedData = async (data) => {
  const materialId = data?.materialId;
  if (cachedProductDetailsResponse[materialId]) {
    return cachedProductDetailsResponse[materialId];
  }

  return await getProductDetails(data);
}

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
  userInformation,
  isLoggedIn,
  isIPSUser,
  contractName,
  contractId,
  includeSpecifications = true,
  includeVariants = true,
}) => {
  try {
    const {
      currencyCode,
      webLoginProfileId: userId,
      webGroup: { webGroupId } = {},
      account: { soldToId: soldTo } = {},
      UserType: userType,
      isCES,
      defConsortiaId: consortiaId,
    } = userInformation || {}
    const apiData = {
      locale,
      materialId: decodeURIComponent(materialId),
      salesOrg,
      includeSpecifications,
      includeVariants,
      currencyCode,
    }
    const ipsPostData = {
      ...apiData,
      soldTo: soldTo || null,
      userId: userId || null,
      webGroup: webGroupId || null,
      contractType: contractName,
      contractId,
      nonLoggedInIpsUser: !isLoggedIn,
      ipsUser: isIPSUser
    }

    const postData = isLoggedIn ? {
      ...apiData,
      soldTo,
      userId,
      webGroup: webGroupId,
      ...(consortiaId && {consortiaId}),
    } : { ...apiData }
    
    const payload = isIPSUser ? ipsPostData : postData
    await addFieldsForHybridX({ isLoggedIn, isCES }, payload, { userType })
    const { data } = await axios({
      headers: { 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json'},
      method: POST,
      url: '/gapi/product-management/product',
      data: payload
    })

    if (!data.product) throw new Error('Error finding product')
    cachedProductDetailsResponse[materialId] = data;
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch product details`, err)
    throw err
  }
}

/** Get Product Information API - Used for mini PDP
 *
 * Get product information using the provided options
 * @param {string} locale - User locale
 * @param {string} materialId - Unique product id
 */

export const getProductInformation = async ({ contractId, locale, materialId, salesOrg }) => {
  try {
    const res = await axios({
      method: GET,
      url: `/insightweb/cs/endUser/productInformation`,
      params: { locale, matId: materialId, contractId, salesOrg },
    })
    return res
  } catch (err) {
    console.warn(`Failed to fetch PDP information`, err)
    throw err
  }
}

export default {
  getProductDetails,
  getProductInformation,
}
