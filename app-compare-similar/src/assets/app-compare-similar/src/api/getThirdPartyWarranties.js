import axios, { POST } from './axios'
import { l } from '@insight/toolkit-utils'
import { getSessionUser } from './getSessionUser'
import getProductDetails from './getProductDetails'

/** Get Third party warranties
 *
 * Get product placements using the provided options
 * @param {string} materialId - Unique product/material id
 * @param {string} salesOrg - Sales Org
 *
 * @returns {array} array of third party warranties
 */
export const getThirdPartyWarranties = async (materialId, salesOrg, ipsUser = false, contractId = '') => {
  try {
    const {
      userInformation,
      isIpsLogo
    } = await getSessionUser()
    const soldto = userInformation?.account?.soldToId
    const wg = userInformation?.webGroup?.webGroupId
    const locale = l()
    const { product } = await getProductDetails({
      materialId,
      locale,
      salesOrg,
    })
    const webPrice = product?.price?.webPrice
    const categoryCode = product?.category?.code
    const manufacturerRule = product?.manufacturer?.name
    const materialQualifier = product?.materialQualifier
    const productTypeRule = product?.productTypeRule
    const request = {
      ces: true, //app-compare-similar is always CES, including default logged-out users
      contractId,
      categoryCode,
      materialQualifier,
      matId: materialId,
      manufacturerRule,
      productTypeRule,
      salesOrg,
      locale,
      ipsUser,
      soldto,
      uid: userInformation?.webLoginProfileId,
      price: webPrice,
      wg,
      filterCallForPrice: false, // true will filter warranties with call for price
    }
    const { data } = await axios({
      method: POST,
      url: '/insightweb/getWarranty',
      data: request,
    })
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch third party warranties`, err)
    return []
  }
}
