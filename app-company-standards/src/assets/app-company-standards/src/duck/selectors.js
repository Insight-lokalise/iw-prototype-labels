import { getInObject, l } from '@insight/toolkit-utils'

import { getLanguage } from '../lib'

export function selector_appTitle(state) {
  return getInObject(selector_settings(state), 'header', { en: 'Company Standards' })
}

export function selector_cache(state, id) {
  return getInObject(state, ['cache', id], false)
}

export function selector_differentWebgroupCategories(state) {
  return getInObject(state, 'differentWebgroupCategories', {})
}

export function selector_category(state, id) {
  return getInObject(state, ['categories', id], undefined)
}

export function selector_categories(state) {
  return getInObject(state, 'categories', {})
}

export function selector_categoryOrder(state) {
  return getInObject(state, 'categoryOrder', [])
}

export function selector_configSkuDropdownOptions(state) {
  return ['NONE', ...getInObject(selector_settings(state), 'configTypes', [])].map(opt => ({ text: opt, value: opt }))
}

export function selector_defaultLanguage(state) {
  const locale = getInObject(selector_settings(state), 'defaultLanguage', l())
  return getLanguage(locale)
}

export function selector_ipsContracts(state) {
  return getInObject(state, 'ipsContracts', [])
}

export function selector_isIps(state) {
  return getInObject(selector_settings(state), 'salesArea') === 2
}

export function selector_isManagerView(state) {
  return getInObject(state, 'isManagerView', false)
}

export function selector_labFees(state, { labConfig }) {
  return getInObject(state, ['labFees', labConfig], [])
}

export function selector_languages(state) {
  const languages = getInObject(selector_settings(state), 'languages', { [l()]: true })
  return Object.keys(languages)
    .filter(lang => languages[lang])
    .map(lang => getLanguage(lang))
}

export function selector_loadingState(state) {
  return getInObject(state, 'initialLoading', {})
}

export function selector_locale(state) {
  return getInObject(selector_settings(state), 'defaultLanguage', 'en_US')
}

export function selector_locked(state) {
  return getInObject(selector_settings(state), 'locked', false)
}

export function selector_productGroup(state, id) {
  return getInObject(state, ['productGroups', id], undefined)
}

export function selector_productGroups(state) {
  return getInObject(state, ['productGroups'], {})
}

export function selector_productSet(state, id) {
  return getInObject(state, ['productSets', id], undefined)
}

export function selector_productSets(state) {
  return getInObject(state, ['productSets'], {})
}

export function selector_productSetItems(state, productSetId) {
  return getInObject(state, ['productSetItems', productSetId], null)
}

export function selector_salesArea(state) {
  return getInObject(selector_settings(state), 'salesArea', null)
}

export function selector_settings(state) {
  return getInObject(state, 'settings', {})
}

export function selector_tag(state, id) {
  return getInObject(state, ['tags', id], undefined)
}

export function selector_taggingEnabled(state) {
  return getInObject(selector_settings(state), ['taggingEnabled'], false)
}

export function selector_tags(state) {
  return getInObject(state, ['tags'], {})
}

export function selector_wId(state) {
  return getInObject(state, 'wId', '')
}
