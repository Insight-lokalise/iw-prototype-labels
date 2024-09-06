import axios from 'axios'

let cachedResponse

export default function getContracts() {
  if (!cachedResponse) {
    const timestamp = new Date().getTime()
    cachedResponse = axios
      .get(`/insightweb/endUser/getContracts/${timestamp}`)
      .catch(error => {
        console.warn('Failed to fetch contract data', error)
        throw error
      })
  }

  return cachedResponse
}