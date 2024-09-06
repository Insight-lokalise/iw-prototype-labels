import axios from 'axios'

export default function getRatingsAndReviews(data) {
  return axios.post('/insightweb/reviews', data)
    .catch(error => {
      console.warn('Failed to retrieve reviews')
      throw error
    })
}
