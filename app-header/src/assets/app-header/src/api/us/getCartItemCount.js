import axios from 'axios'

const CART_DATA_URL = '/insightweb/cartItemCount?_='

let cachedResponse

export default function getCartItemCount(forceRefresh) {
  if (!cachedResponse || forceRefresh) {
    const timestamp = new Date().getTime()
    cachedResponse = axios
      .get(`${CART_DATA_URL}${timestamp}`)
      .catch(error => {
        console.warn('Failed to fetch cart data', error)
        throw error
      })
      .then(({ data }) => data.quantity)
  }

  return cachedResponse
}
