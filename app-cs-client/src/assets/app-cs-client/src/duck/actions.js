import {
  ADD_PIN,
  CLEAR_FILTERS,
  GET_USERDATA,
  GET_CART_ITEM_COUNT,
  FETCH_PRODUCT_SETS,
  SAVE_USERDATA,
  SAVE_CATEGORIES,
  SAVE_LOCALE,
  SAVE_PINS,
  SAVE_PRODUCT_GROUPS,
  SAVE_PRODUCT_SETS,
  SAVE_TAGS,
  SAVE_USER_SETTINGS,
  SAVE_WEB_GROUP_SETTINGS,
  TOGGLE_FILTER
} from './types'

export function addPin(payload) {
  return { type: ADD_PIN, payload }
}

export function clearFilters() {
  return { type: CLEAR_FILTERS }
}

export function saveCategories(payload) {
  return { type: SAVE_CATEGORIES, payload }
}

export function saveLocale(payload) {
  return { type: SAVE_LOCALE, payload }
}

export function savePins(payload) {
  return { type: SAVE_PINS, payload}
}

export function saveProductGroups(payload) {
  return { type: SAVE_PRODUCT_GROUPS, payload }
}

export function saveProductSets(payload) {
  return { type: SAVE_PRODUCT_SETS, payload }
}

export function fetchProductSetsPending() {
  return { type: FETCH_PRODUCT_SETS }
}

export function saveTags(payload) {
  return { type: SAVE_TAGS, payload }
}

export function saveUserSettings(payload) {
  return { type: SAVE_USER_SETTINGS, payload }
}

export function saveWebGroupSettings(payload) {
  return { type: SAVE_WEB_GROUP_SETTINGS, payload }
}

export function toggleFilter(payload) {
  return { type: TOGGLE_FILTER, payload}
}

export function getInsightUserData() {
  return { type: GET_USERDATA }
}

export function saveInsightUserData(payload) {
  return { type: SAVE_USERDATA, payload }
}

export function saveCartItemCount(payload) {
  return { type: GET_CART_ITEM_COUNT, payload}
}
