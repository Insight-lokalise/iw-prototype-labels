import axios, { POST } from './axios'

/** Get Proposition 65 Compliance API
 *
 * Get prop 65 verbaige for the current material using the provided options
 * @param {string} categoryId - Product category id
 * @param {string} manufacturerId - Unique manufacturer id
 * @param {string} salesOrg
 */
export const getPropositionCompliance = async ({
  categoryId,
  manufacturerId,
  salesOrg,
}) => {
  try {
    const { data } = await axios({
      method: POST,
      url: '/insightweb/prop65Compliance',
      params: {
        categoryId,
        erpMfrId: decodeURIComponent(manufacturerId),
        salesOrg,
      },
    })
    if (!data || !data.length) {
      throw new Error('Error finding prop sixty five message')
    }
    return data[0]
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch prop sixty five message`, err)
    throw err
  }
}

export default {
  getPropositionCompliance,
}
