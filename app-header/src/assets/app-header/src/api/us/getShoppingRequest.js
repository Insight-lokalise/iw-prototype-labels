import axios from "axios";

export function getShoppingRequest() {
  return axios
    .get('/insightweb/shoppingRequest')
    .catch(error => {
      console.warn('Failed to fetch session shopping request', error)
      throw error
    })
    .then(({data}) => data)
}
