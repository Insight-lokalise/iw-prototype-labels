import { MENU_DATA_LOCAL_STORAGE_ID } from './constants'

export default function setCachedAemMenuItems(aemMenuItems) {
  try {
    window.localStorage.setItem(MENU_DATA_LOCAL_STORAGE_ID, JSON.stringify(aemMenuItems))
  } catch (error) {
    console.warn('Failed to set local storage')
    console.error(error)
  }
}
