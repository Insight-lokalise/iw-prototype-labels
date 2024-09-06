import {
  GET_ADVANCED_SEARCH,
  GET_ORDERBY_ORDER_OR_PO_NUMBER,
  GET_ORDER_HISTORY,
  SAVE_LAST_RESPONSE,
  SAVE_LAST_SEARCH,
} from './../types'

export default function simpleSearchResults(state = {}, { type, payload }) {
  switch (type) {
    case GET_ORDER_HISTORY:
      return {
        ...state,
        ...payload,
        isAdvancedSearch: false,
        searchView: 'orderHistory',
      }
    case GET_ORDERBY_ORDER_OR_PO_NUMBER:
      return {
        ...state,
        ...payload,
        isAdvancedSearch: false,
        searchView: 'quickSearch',
        searchObj: payload.simpleSearchObject,
      }
    case GET_ADVANCED_SEARCH:
      return {
        ...state,
        ...payload,
        isAdvancedSearch: true,
        searchView: 'advancedSearch',
        searchObj: payload.advancedSearchObject,
      }
    case SAVE_LAST_SEARCH:
      return {
        ...state,
        ...payload,
      }
    case SAVE_LAST_RESPONSE:
      return {
        ...state,
        ...payload,
      }

    default:
      return state
  }
}
