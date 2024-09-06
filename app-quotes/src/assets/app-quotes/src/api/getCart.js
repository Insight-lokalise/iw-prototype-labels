import axios, { GET, POST } from './axiosConfig'
import { getTaxAndEWRFee } from './getData'
import { fetchShippingCarriers, getCarrier } from '../api'
import { shippingCarrier } from '../lib/helpers'

/** Get Cart API
 *
 * Get transformed cart to shopping request */
export const getCart = async () => {
  try {
    const { data } = await axios({
      method: GET,
      url: `insightweb/shoppingRequest`,
    })
    if (!data) {
      throw new Error('Error retrieving shopping cart')
    }
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Error retrieving shopping cart`, err)
    throw err
  }
}

export default {
  getCart,
}
