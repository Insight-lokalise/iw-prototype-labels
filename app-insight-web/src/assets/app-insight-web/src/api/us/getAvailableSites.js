import axios from 'axios'

export default function getAvailableSites() {
    return axios.get('/insightweb/endUser/websites')
      .then(res => res.data)
      .catch(error => {
        console.warn('Failed to fetch available websites data', error)
        throw error
      })
}
