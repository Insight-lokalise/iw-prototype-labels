import get from 'lodash/get'

const selector_orderSearch = state => get(state, 'orderSearch', {})

export const selector_searchOrdersPagination = state => selector_orderSearch(state).searchOrdersPagination || {}
