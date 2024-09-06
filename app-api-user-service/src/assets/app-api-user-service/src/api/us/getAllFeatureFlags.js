import axios from 'axios'

let cachedResponse

export default function getAllFeatureFlags(name) {
  if (!cachedResponse) {
    const url = `/insightweb/feature-flags-all-user`
      cachedResponse = axios
      .get(url)
      .catch(error => {
        console.warn(`Failed to fetch all feature flags`, error)
        throw error
      }).then(({data})=>{
              window.flags = data
              return data
      })
  }
  return cachedResponse
}
