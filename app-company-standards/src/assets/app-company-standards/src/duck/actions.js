import {
  CACHE,
  DELETE_TAG,
  FAIL_INITIALLOAD,
  GET_INITIALLOAD,
  REMOVE_CACHE,
  REORDER_CATEGORY,
  REORDER_PRODUCTGROUP,
  REORDER_PRODUCTSET,
  REORDER_PRODUCTITEM,
  SAVE_DIFFERENT_WEBGROUP_CATEGORIES,
  SAVE_CATEGORIES,
  SAVE_CATEGORYORDER,
  SAVE_INITIALLOAD,
  SAVE_IPS_CONTRACTS,
  SAVE_LAB_FEES,
  SAVE_MANAGER_FLAG,
  SAVE_PRODUCT_SET_ITEMS,
  DELETE_PRODUCT_SET_ITEMS,
  SAVE_PRODUCTGROUPS,
  SAVE_PRODUCTSETS,
  SAVE_SETTINGS,
  SAVE_TAGS,
  SAVE_WEBGROUPID,
  PUBLISH_ALL_FLUSH,
} from './types'

export function addCache(payload) {
  return { type: CACHE, payload }
}

export function failInitialLoad(payload) {
  return { type: FAIL_INITIALLOAD, payload }
}

export function getInitialLoad() {
  return { type: GET_INITIALLOAD }
}

export function removeCache(payload) {
  return { type: REMOVE_CACHE, payload }
}

export function reorderCategory(id, order) {
  return { type: REORDER_CATEGORY, payload: { id, order } }
}

export function reorderProductGroup(id, order) {
  return { type: REORDER_PRODUCTGROUP, payload: { id, order } }
}

export function reorderProductSet(id, order) {
  return { type: REORDER_PRODUCTSET, payload: { id, order } }
}

export function reorderProductItem(id, order) {
  return { type: REORDER_PRODUCTITEM, payload: { id, order } }
}

export function saveDifferentWebGroupCategories(payload) {
  return { type: SAVE_DIFFERENT_WEBGROUP_CATEGORIES, payload }
}

export function saveCategories(payload) {
  return { type: SAVE_CATEGORIES, payload }
}

export function saveCategoryOrder(payload) {
  return { type: SAVE_CATEGORYORDER, payload }
}

export function saveInitialLoad() {
  return { type: SAVE_INITIALLOAD }
}

export function saveIpsContracts(payload) {
  return { type: SAVE_IPS_CONTRACTS, payload }
}

export function saveLabFees(payload) {
  return { type: SAVE_LAB_FEES, payload }
}

export function saveManagerFlag(payload) {
  return { type: SAVE_MANAGER_FLAG, payload }
}

export function saveProductGroups(payload) {
  return { type: SAVE_PRODUCTGROUPS, payload }
}

export function saveProductSetItems(payload) {
  return { type: SAVE_PRODUCT_SET_ITEMS, payload }
}

export function deleteProductSetItems(payload) {
  return { type: DELETE_PRODUCT_SET_ITEMS, payload }
}

export function saveProductSets(payload) {
  return { type: SAVE_PRODUCTSETS, payload }
}

export function saveSettings(payload) {
  return { type: SAVE_SETTINGS, payload }
}

export function saveTags(payload) {
  return { type: SAVE_TAGS, payload }
}

export function delTag(payload) {
  return { type: DELETE_TAG, payload }
}

export function saveWebGroupId(payload) {
  return { type: SAVE_WEBGROUPID, payload }
}

export function publishAllFlush() {
  return { type: PUBLISH_ALL_FLUSH }
}
