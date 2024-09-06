import axios from 'axios'

let cachedResponse
/**
 * Fetch a map of menu item IDs that should be filtered out.
 */
export default function getLoggedInFilterMap(locale) {
  if (!cachedResponse) {
    const timestamp = new Date().getTime()

    cachedResponse = axios
      .get(`/insightweb/menu/loggedInFooterMenu?c=${locale}&q=${timestamp}&f=footer`)
      .then(res => res.data)
      .catch(err => {
        console.error(err)
        return {}
      })
  }

  return cachedResponse
}
