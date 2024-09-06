import { MENU_DATA_LOCAL_STORAGE_ID } from './constants'

/**
 * Retrieve cached menu data from local storage. Return the data if present,
 * otherwise, throw an error, which will prevent the menu from being rendered
 * until the data has been fetched.
 */
export default function getCachedAemMenuItems() {
  let data = null

  try {
    data = window.localStorage.getItem(MENU_DATA_LOCAL_STORAGE_ID)
  } catch (error) {
    console.warn('Failed to get local storage')
    console.error(error)
  }

  return Promise.resolve(data ? JSON.parse(data) : null)
}
