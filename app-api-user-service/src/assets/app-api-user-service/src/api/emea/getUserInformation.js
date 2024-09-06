import axios from 'axios'

let cachedResponse

export default function getUserInformation() {
  if (!cachedResponse) {
    const { path, contactId } = window.appUserService
    const url = `${path}${contactId}`

    cachedResponse = axios
      .get(url)
      .catch(error => {
        console.warn('Failed to fetch user information', error)
        throw error
      })
  }

  return cachedResponse
}
