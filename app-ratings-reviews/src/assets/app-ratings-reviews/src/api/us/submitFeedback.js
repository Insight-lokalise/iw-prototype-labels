import axios from 'axios'

export default function submitFeedback(data) {
  return axios.post('/insightweb/submitfeedback', data)
    .catch(error => {
      console.warn('Failed to submit feedback')
      throw error
    })
}
