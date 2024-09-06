import axios from 'axios'

export default function submitReview(data) {
  return axios.post('/insightweb/submitReview', data)
    .catch(error => {
      console.warn('Failed to submit review')
      throw error
    })
}
