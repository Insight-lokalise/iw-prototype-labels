import { FILTERED_ITEMS_MAP_LOCAL_STORAGE_ID } from './constants'

export default function setCachedFilteredItemsMap(filteredItemsMap) {
  try {
    window.localStorage.setItem(`${FILTERED_ITEMS_MAP_LOCAL_STORAGE_ID}`, JSON.stringify(filteredItemsMap))
  } catch (error) {
    console.warn('Failed to set local storage')
    console.error(error)
  }
  return filteredItemsMap
}
