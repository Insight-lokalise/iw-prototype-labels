import axios from '../../../app/libs/axiosConfig'

export function saveCartAsList({ name, shoppingRequest, userId }) {
  return axios({
    method: 'post',
    url: `gapi/saved-cart/user/${userId}/save-cart/${name}`,
    data: shoppingRequest,
  }).catch(error => {
    console.warn(`Failed to save cart as list`, error)
    throw error
  })
}
