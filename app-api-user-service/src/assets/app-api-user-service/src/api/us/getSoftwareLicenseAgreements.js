import axios from 'axios'

let cachedResponse

export default function getSoftwareLicenseAgreements() {
  if (!cachedResponse) {
    cachedResponse = axios
      .get(`/insightweb/softwareAgreements`)
      .catch(error => {
        console.warn('Failed to get software agreements', error)
        return { data: null }
      });
  }

  return cachedResponse
}
