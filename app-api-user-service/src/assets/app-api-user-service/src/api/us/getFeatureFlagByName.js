import axios from 'axios'

let cachedResponse

export default function getFeatureFlagByName(name) {
  if (!cachedResponse) {
    const timestamp = new Date().getTime()
    const url = `/insightweb/feature-flag?flagname=${name}`

    cachedResponse = axios
      .get(url)
      .catch(error => {
        console.warn(`Failed to fetch feature flag ${name}`, error)
        throw error
      })
  }

  return cachedResponse
}
