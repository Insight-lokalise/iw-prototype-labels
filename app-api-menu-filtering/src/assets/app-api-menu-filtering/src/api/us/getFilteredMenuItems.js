import axios from 'axios'

const FILTERED_MENU_DATA_URL = `${window.siteServiceBase}/menufilter/v2/menu/${window.siteEntity}`

// Cache all request promises for the duration of the page, keyed on the
// requested locale string.
const promises = {}

/**
 * Fetch a list of all the menu items that should be filtered out, for both
 * the header and the footer.
 */
export default function getFilteredMenuItems(locale) {
  if (!promises[locale]) {
    const url = `${FILTERED_MENU_DATA_URL}/${locale}?src=/menu`
    const method = 'get'
    const withCredentials = 'same-origin'

    // Store the promise so that it can be shared by header and footer.
    promises[locale] = axios({ url, method, withCredentials })
      .catch(error => {
        console.warn('Failed to fetch user menu data', error)
        throw error
      })
      .then(({ data }) => data)
  }

  return promises[locale]
}
