import axios from "axios";

export function prepareUIShoppingCart() {
  return axios
    .get('/insightweb/sessionCartToShoppingRequest')
    .catch(error => {
      console.warn('Failed to derive UI shopping request from session shopping request', error)
      throw error
    })
    .then(({data}) => data)
}
