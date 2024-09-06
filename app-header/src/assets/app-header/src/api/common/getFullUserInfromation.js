import axios from 'axios'

let cachedResponse

export default function getFullUserInformation() {
  if (!cachedResponse) {
    const timestamp = new Date().getTime()
    const url = `/insightweb/getUserInformation?q=${timestamp}`

    cachedResponse = axios
      .get(url)
      .catch(error => {
        console.warn('Failed to fetch user information', error)
        throw error
      })
  }

  return cachedResponse
}
