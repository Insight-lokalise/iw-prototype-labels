import axios, { GET } from './axiosConfig'
import { getUserInformation } from 'app-api-user-service'

/** Process Carts
 *
 * Normalize shopping request to use with resource table
 */
const processCarts = (carts) => {
  return carts?.reduce((acc, cart) => {
    const {
      id,
      createdOn: date,
      name,
      itemCount: totalQty,
      currency
    } = cart
    return acc.concat([{ id, date, name, totalQty, currency }])
  }, [])
}

/** Get Stored Carts API
 *
 * Return a list of stored carts filtered using the query param
 * * @param {string} query - used to filter stored carts
 * */
let cachedLoginId

export const getLoginId = async () => {
  if (!cachedLoginId) {
    await getUserInformation().then(({ data }) => {
      cachedLoginId = data?.userInformation?.webLoginProfileId
    })
  }
  return cachedLoginId
}

export const getStoredCarts = async (query) => {
  const loginId = await getLoginId();
  const endpoint = `gapi/saved-cart/user/${loginId}/save-cart`
  const params = !!query ? { filter: query } : {}

  const { data } = await axios({
    method: GET,
    url: endpoint,
    params,
  })
  return processCarts(data?.shoppingRequestList || [])
}

export const getStoredCart = async (id) => {
  const loginId = await getLoginId();
  const endpoint = `gapi/saved-cart/user/${loginId}/save-cart/${id}`

  const { data } = await axios({
    method: GET,
    url: endpoint
  })
  return data
}
