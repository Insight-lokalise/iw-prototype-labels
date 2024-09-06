import axios, { GET } from './axiosConfig'

/** Get Product Information API - Used for mini PDP
 *
 * Get product information using the provided options
 * @param {string} locale - User locale
 * @param {string} materialId - Unique product id
 */

export const getProductInformation = async ({ locale, materialId }) => {
  try {
    const res = await axios({
      method: GET,
      url: `/insightweb/cs/endUser/productInformation`,
      params: { locale, matId: materialId },
    })
    return res
  } catch (err) {
    console.warn(`Failed to fetch PDP information`, err)
    throw err
  }
}

export default {
  getProductInformation,
}
