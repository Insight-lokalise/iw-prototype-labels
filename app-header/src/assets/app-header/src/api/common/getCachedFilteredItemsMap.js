import { getFilteredItemsMapId } from './util'

/**
 * Retrieve cached menu data from local storage. Return the data if present,
 * otherwise, throw an error, which will prevent the menu from being rendered
 * until the data has been fetched.
 */
export default function getCachedFilteredItemsMap(userEmail) {
  let data = null

  try {
    data = window.localStorage.getItem(getFilteredItemsMapId(userEmail))
  } catch (error) {
    console.warn('Failed to get filteredItemsMap from local storage')
    console.error(error)
  }

  return Promise.resolve(data ? JSON.parse(data) : null)
}
