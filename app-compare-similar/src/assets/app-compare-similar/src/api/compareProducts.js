import axios, { GET, POST } from './axios'
import { addFieldsForHybridX } from 'app-api-user-service'
import { createPayloadForCompareApi } from '../helpers/createPayloadForCompareApi'

/** Get Compare List And Similar API
 *
 * Get list of compared products using the provided options
 * @param {string} q - List of SKUs seperated with encoded pipe(|) character(%7)
 */
export const getComparedProducts = async (q) => {
  const { params, isLoggedIn, isCES, userType } = await createPayloadForCompareApi();
  const isHybridEnabled = await addFieldsForHybridX({ isLoggedIn, isCES }, params, { userType })
  if (isHybridEnabled) {
    try {
      const { data } = await axios({
        method: POST,
        url: `/gapi/product-search/compare`,
        data: {
          ...params
        },
      })
      return data
    } catch (err) {
      console.warn(`Failed to fetch product search information`, err)
      throw err
    }
  }

  try {
    const { data } = await axios({
      method: GET,
      url: '/gapi/product-search/compare',
      params,
    })
    if (!data) throw new Error('Error finding compared products')
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch compared products`, err)
    throw err
  }
}

export default {
  getComparedProducts,
}
