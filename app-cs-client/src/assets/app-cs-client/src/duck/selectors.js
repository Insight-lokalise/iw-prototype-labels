import { getInObject } from '@insight/toolkit-utils'

import { filterCategoriesByTags, filterProductGroupsByTags } from "../lib/helpers";
import { getLanguage } from "../lib";

export function selector_userData(state) {
  return getInObject(state, 'userData', [])
}

export function selector_userPermissions(state) {
  return getInObject(selector_userData(state), ['userPermissions'], [])
}

export function selector_webGroupPermissions(state) {
  return getInObject(selector_userData(state), ['webGroupPermissions'], [])
}
export function selector_isB2bUser(state) {
  return getInObject(selector_userData(state), ['isB2bUser'], false)
}

export function selector_isSharedUser(state) {
  return getInObject(selector_userData(state), ['isSharedUser'], false)
}

export function selector_isEMEA(state) {
  return getInObject(selector_userData(state), ['isEMEA'], false)
}

export function selector_isSharedAccount(state) {
  return getInObject(selector_userData(state), ['isSharedAccount'], false)
}

export function selector_isPinsEnabled(state) {
  return !selector_isB2bUser(state) && !selector_isSharedUser(state)
}

export function selector_isPurchasingPopupEnabled(state) {
  return selector_userPermissions(state).includes('enable_purchase_popup')
}

export function selector_isViewPriceEnabled(state) {
  return selector_userPermissions(state).includes('price')
}

export function selector_isCallForPrice(state) {
  return !selector_userPermissions(state).includes('price')
}
export function selector_categories(state) {
  return getInObject(state, 'categories', [])
}

export function selector_filteredCategories(state) {
  return filterCategoriesByTags(
    selector_categories(state),
    selector_productGroups(state),
    selector_filters(state),
    selector_pins(state),
  )
}

export function selector_category(state, id) {
  return selector_categories(state).find(category => category.id === id)
}

export function selector_filters(state) {
  const allTags = selector_allTags(state)
  return Object.keys(allTags).filter(tagId => allTags[tagId].filterBy)
}

export function selector_productGroup(state, id) {
  return getInObject(state, [ 'productGroups', id ], {})
}

export function selector_productGroups(state, idArray) {
  const groups = getInObject(state, 'productGroups', {})
  const mappingArray = idArray || Object.keys(groups)
  return mappingArray.map(id => groups[id])
}

export function selector_filteredProductGroups(state, idArray) {
  return filterProductGroupsByTags(
    selector_productGroups(state, idArray),
    selector_filters(state),
    selector_pins(state)
  )
}

export function selector_productSets(state, id) {
  return getInObject(state, [ 'productSets', id ], undefined)
}

export function selector_fetchProductSetsPending(state) {
  return getInObject(state, [ 'productSets', 'isPending' ], false)
}

export function selector_isLoaded(state) {
  const webGroupSettings = selector_webGroupSettings(state)
  return Object.keys(webGroupSettings).length > 0
}

export function selector_isPinned(state, id) {
  return selector_pins(state).includes(id)
}

export function selector_language(state) {
  return getLanguage(selector_locale(state))
}

export function selector_locale(state) {
  return getInObject(state, 'locale', 'en_US')
}

export function selector_pins(state) {
  return getInObject(state, 'pins', [])
}

export function selector_allTags(state) {
  return getInObject(state, 'tags', {})
}

export function selector_tags(state, tagArray = []) {
  const tags = getInObject(state, 'tags', {})
  return tagArray.map(id => tags[id])
}

export function selector_userSettings(state) {
  return getInObject(state, 'userSettings', {})
}

export function selector_webGroupSettings(state) {
  return getInObject(state, 'webGroupSettings', {})
}

export function selector_taggingEnabled(state) {
  return selector_webGroupSettings(state).taggingEnabled
}

export function selector_isViewAvailabilityEnabled(state){
  return !selector_webGroupPermissions(state).includes('disable_stock_and_price_display')
}
export function selector_isStockAndPriceDisplay(state){
  return !selector_webGroupPermissions(state).includes('disable_stock_and_price_display')
}
