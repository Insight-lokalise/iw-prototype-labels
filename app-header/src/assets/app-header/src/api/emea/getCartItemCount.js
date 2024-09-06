import axios from 'axios'

let cachedResponse

export default function getCartItemCount(forceRefresh) {
  if (!cachedResponse || forceRefresh) {
    cachedResponse = axios
      .get(`${window.siteServiceBase}/Transaction/v2/Cart/Items/Count`)
      .catch(error => {
        console.warn('Failed to fetch cart item count', error)
        throw error
      })
      .then(({ data }) => data.itemCount)
  }

  return cachedResponse
}
