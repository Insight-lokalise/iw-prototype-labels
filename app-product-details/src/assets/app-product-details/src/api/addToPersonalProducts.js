import axios, { POST } from './axios'

const ADD_TO_PERSONAL_PRODUCTS_URL = `/insightweb/favitems`

export default function addToPersonalProducts(productList) {
  return axios
    .post(`${window.location.origin}${ADD_TO_PERSONAL_PRODUCTS_URL}`, productList)
    .then(({ data }) => data)
    .catch(error => {
      console.warn(`Failed to add item ${productList.join(', ')} to personal product list`)
      throw error
    })
}