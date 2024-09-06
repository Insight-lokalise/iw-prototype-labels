import axios from 'axios'

export default function flushFilterMenuCache() {
  const url = `/insightweb/menu/flushMenu`
  return axios
    .get(url)
    .catch(error => {
      console.warn('Failed to flush filtered menu cache', error)
      throw error
    })
}
