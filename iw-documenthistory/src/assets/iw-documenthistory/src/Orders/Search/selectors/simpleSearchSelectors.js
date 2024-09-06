import get from 'lodash-es/get'

import { thirtyDaysAgo } from '../constants/Date'
import { selector_hasMyOrdersOnlyPermission } from '../../../Shared/selectors'

export function selector_simpleSearchResults(state) {
  return get(state, ['orderSearch', 'simpleSearchResults'], {})
}
export const selector_simpleSearchOrders = state => selector_simpleSearchResults(state).orders || []
export const selector_isAdvancedSearch = state => selector_simpleSearchResults(state).isAdvancedSearch || false
export const selector_simpleSearchTotalRecords = state => selector_simpleSearchResults(state).totalRecords || null
export const selector_searchView = state => selector_simpleSearchResults(state).searchView || 'orderHistory'
export const selector_searchObject = state => selector_simpleSearchResults(state).searchObj || {}
export const selector_sortOrder = state => selector_simpleSearchResults(state).sortOrder != null ? selector_simpleSearchResults(state).sortOrder : 1 //check for null so 0 can be a valid value
export const selector_sortBy = state => selector_simpleSearchResults(state).sortBy || 3
export const selector_startPage = state => selector_simpleSearchResults(state).startPage || 1
export const selector_lastOrdersSearch = state => selector_simpleSearchResults(state).lastOrdersSearch || ''
export const selector_lastResponse = state => selector_simpleSearchResults(state).lastResponse || ''
export const selector_recordsPerPage = state => selector_simpleSearchResults(state).recordsPerPage || 5
export const selector_searchInitialValues = state => selector_simpleSearchResults(state).searchValues || {}

const startDate = thirtyDaysAgo(new Date())
const endDate = new Date()

export function selector_advancedSearchInitialValues(state) {
  const searchValues = selector_searchInitialValues(state)
  const isAdvancedSearch = selector_isAdvancedSearch(state)
  const showOnlyMyOrders = selector_hasMyOrdersOnlyPermission(state)
  const initialValues = {
    status: 0,
    startDate,
    endDate,
    orders: showOnlyMyOrders ? 1 : 0,
    orderType: 0,
    levelIndex: 1,
    productType: 0,
  }
  return isAdvancedSearch ? searchValues : initialValues
}

export function selector_accountsByRegion(state) {
  return get(state, ['orderSearch', 'accountsByRegion'], {})
}

export function selector_simplifiedSearch(state) {
  return get(state, ['orderSearch', 'simplifiedSearch'], {})
}
export const selector_operationCenters = state => get(selector_accountsByRegion(state), 'operationCenters', [])
export const selector_selectionList = state => get(selector_accountsByRegion(state), 'SelectionList', [])

export function selector_opsCenterList(state) {
  return selector_operationCenters(state).map(option => ({
    value: option.regionCode,
    displayName: option.regionDescription,
  }))
}

export function selector_regionsList(state) {
  return selector_operationCenters(state).map(option => option.hierarchyRegion)
}
