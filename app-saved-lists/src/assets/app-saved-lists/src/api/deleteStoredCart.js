import axios, { DELETE } from './axiosConfig'

export const deleteStoredCart = async (loginId, cartId, itemId, isWarrantyOnly) => {
  const endpoint = itemId ?
  `gapi/saved-cart/user/${loginId}/save-cart/${cartId}/item/${itemId}?warrantyOnly=${isWarrantyOnly}`
  :`gapi/saved-cart/user/${loginId}/save-cart/${cartId}`
  return axios({
    method: DELETE,
    url: endpoint,
  }).catch( error => {
    console.warn('Error happen in delete stored lists')
    throw error
  })
}

export default deleteStoredCart

