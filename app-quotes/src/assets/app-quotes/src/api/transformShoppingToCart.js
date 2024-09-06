import axios, { GET } from './axiosConfig'

/**
 * Transform the User's session shopping request to the cart
 * @return {Object} cart object
 */
export const transformShoppingToCart = async () => {
  try {
    const { data } = await axios({
      method: GET,
      url: `insightweb/transformShoppingRequestToCart`,
    })
    return data
  } catch (err) {
    console.warn('Failed to transform shopping request', error)
    throw error
  }
}

export default {
  transformShoppingToCart,
}
