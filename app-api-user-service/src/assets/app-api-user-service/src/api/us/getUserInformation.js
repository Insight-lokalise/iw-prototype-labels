import axios from 'axios'

let cachedResponse

export default function getUserInformation() {
  if (!cachedResponse) {
    const timestamp = new Date().getTime()
    const url = `/insightweb/headerInformation?q=${timestamp}`

    cachedResponse = axios
      .get(url)
      /* .then(resp => {
        // Add values on window for mPulse tracing
        window.Insight = { ...(window.Insight || {}), userInformation: resp.data.userInformation }
        return resp
      }) */
      .catch(error => {
        console.warn('Failed to fetch user information', error)
        throw error
      })
  }

  return cachedResponse
}
