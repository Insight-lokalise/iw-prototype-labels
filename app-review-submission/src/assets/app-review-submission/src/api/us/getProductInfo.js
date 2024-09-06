import axios from 'axios'

export default function getProductInfo({locale, materialId}) {
  return axios.post('/insightweb/bvProductInfo', {locale, productId:materialId})
    .catch(error => {
      console.warn('Failed to get product info')
      throw error
    })
}
