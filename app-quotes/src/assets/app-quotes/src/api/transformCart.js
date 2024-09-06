import axios, { GET } from './axiosConfig'

/**
 * Transform the User's session cart to the shopping request
 * @return {Object} cart object
 */
export const transformCart = async () => {
  try {
    const { data } = await axios({
      method: GET,
      url: `insightweb/transformCartToShoppingRequest`,
    })
    return data.shoppingRequest
  } catch (err) {
    console.warn('Failed to transform cart', error)
    throw error
  }
}

export default {
  transformCart,
}
