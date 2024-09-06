import axios from 'axios'

export default function updatePersonalProductsSequence(data) {
  return axios.post('/insightweb/favitems/resequence', data)
    .catch(error => {
      console.warn('Failed to update products order')
      throw error
    })
}
