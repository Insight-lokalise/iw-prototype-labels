import get from 'lodash-es/get'

export function selector_genericSearchResults(state) {
  return get(state, ['orderSearch', 'genericOrderHistoryResults'], {})
}
export const selector_genericSearchOrders = state => selector_genericSearchResults(state).orders || []
export const selector_genericAuthType = state => selector_genericSearchResults(state).authType || 'accountNumber'
export const selector_genericSearchType = state => selector_genericSearchResults(state).searchType || 'orderNumber'
export const selector_genericSearchTotalRecords = state => selector_genericSearchResults(state).totalRecords || 0
