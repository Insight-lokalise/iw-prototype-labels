import axios from 'axios'

export default function removeFromPersonalProducts(id) {
  return axios.delete(`/insightweb/favitems/id${id}`)
    .catch(error => {
      console.warn('Failed to delete from favorite items')
      throw error
    })
}
