import axios from 'axios'

export default function fetchGenericOrder(searchObj) {
  return axios.post('orderSearch/tracking', searchObj).catch(error => {
    console.warn('Failed to fetch generic order search')
    throw error
  }).then(response => {
    return response.data
  })
}
