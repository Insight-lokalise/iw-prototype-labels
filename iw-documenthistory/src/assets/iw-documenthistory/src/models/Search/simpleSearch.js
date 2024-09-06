import axios from 'axios'

export default function getOrderByOrderOrPoNumber(filters) {
  return axios.post('orderSearch/quick', filters)
    .then(response => {
      const body = {
        ...response.data,
        simpleSearchObject: filters /* To access searchobj while trigeering API call, on click on pagination */,
      }
      return body
    })
    .catch(error => {
      console.warn('Failed to fetch orders by Order or PoNumber')
      throw error
    })
}
