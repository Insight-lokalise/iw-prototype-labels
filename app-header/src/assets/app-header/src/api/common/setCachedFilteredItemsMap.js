import { getFilteredItemsMapId } from './util'

export default function setCachedFilteredItemsMap(filteredItemsMap, userEmail) {
  try {
    window.localStorage.setItem(getFilteredItemsMapId(userEmail), JSON.stringify(filteredItemsMap))
  } catch (error) {
    console.warn('Failed to set local storage')
    console.error(error)
  }
  return filteredItemsMap
}
