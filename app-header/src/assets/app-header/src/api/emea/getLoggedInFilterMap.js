import axios from 'axios'

const FILTERED_MENU_DATA_URL = `${window.siteServiceBase}/menufilter/v3/menu/${window.siteEntity}`

// Cache all request promises for the duration of the page, keyed on the
// requested locale string.
const promises = {}

/**
 * Fetch a list of all the menu items that should be filtered out, for both
 * the header and the footer.
 */
export default function getLoggedInFilterMap(locale) {
  if (!promises[locale]) {
    const url = `${FILTERED_MENU_DATA_URL}/${locale}?src=header`
    const method = 'get'
    const withCredentials = 'same-origin'

    // Store the promise so that it can be shared by header and footer.
    promises[locale] = axios({ url, method, withCredentials })
      .then(({ data }) => {
        const items = data.excludedMenuItems || []
        return items.reduce((acc, curr) => {
          acc[curr] = true
          return acc
        }, {})
      })
      .catch(error => {
        console.warn('Failed to fetch user menu data', error)
        return {}
      })
  }

  return promises[locale]
}
