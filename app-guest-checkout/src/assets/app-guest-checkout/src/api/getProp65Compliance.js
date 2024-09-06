import axios, { POST } from './axiosConfig'

/** Get Product Information API - Used for mini PDP
 *
 * Get product information using the provided options
 * @param {string} locale - User locale
 * @param {string} materialId - Unique product id
 */

export const getProp65Compliance = async (shoppingRequest) => {
  const { data } = await axios({
    method: POST,
    url: '/insightweb/prop65Compliance',
    data: shoppingRequest
  })

  if ((!data || !Array.isArray(data), !data.length)) {
    console.warn('Failed to get prop 65 compliance')
  }

  return {
    data
  }
}
