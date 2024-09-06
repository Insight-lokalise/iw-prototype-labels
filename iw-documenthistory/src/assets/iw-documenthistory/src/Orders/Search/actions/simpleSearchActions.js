import {
  GET_ADVANCED_SEARCH,
  GET_GENERICORDER_SEARCH,
  GET_HIERARCHYTREE_DROPDOWN,
  GET_ORDERBY_ORDER_OR_PO_NUMBER,
  GET_ORDER_HISTORY,
  GET_REGIONS_BYBILLTO,
  SAVE_LAST_SEARCH,
} from '../types'
import {
  fetchAdvancedSearchOrder,
  fetchRegionsByBillTo,
  fetchHierarchyTreeDropDown,
  fetchSimplifiedSearchOrder,
} from '../../../models/Search/advancedSearch'
import getCompleteOrderHistory from '../../../models/OrderDetails/OrderDetails'
import fetchGenericOrder from '../../../models/Search/genericOrderSearch'
import getOrderByOrderOrPoNumber from '../../../models/Search/simpleSearch'
import { selector_searchOrdersPagination } from '../selectors/searchOrdersPaginationSelector'
import saveOrdersPageResponse from './cachingActions'

export function getOrderHistory(filters) {
  const serialized = JSON.stringify(filters)
  return (dispatch) => {
    return getCompleteOrderHistory(filters).then(({ data }) => {
      dispatch({
        type: GET_ORDER_HISTORY,
        payload: { ...data, recordsPerPage: filters.recordsPerPage },
      })
      dispatch(saveOrdersPageResponse(serialized, { ...data, recordsPerPage: filters.recordsPerPage }))
    })
  }
}

export function saveLastSearch(filters) {
  const serialized = JSON.stringify(filters)
  return {
    type: SAVE_LAST_SEARCH,
    payload: { lastOrdersSearch: serialized },
  }
}

export function searchByNumber(filters, searchValues) {
  const serialized = JSON.stringify(filters)
  return (dispatch, getState) => {
    const searchOrder = selector_searchOrdersPagination(getState())
    const pageOrders = searchOrder[serialized]
    if (pageOrders) {
      return Promise.resolve(
        dispatch({
          type: GET_ORDERBY_ORDER_OR_PO_NUMBER,
          payload: {
            ...pageOrders,
            recordsPerPage: filters.recordsPerPage,
            searchValues,
          },
        })
      )
    }
    return getOrderByOrderOrPoNumber(filters).then(response => {
      dispatch({
        type: GET_ORDERBY_ORDER_OR_PO_NUMBER,
        payload: {
          ...response,
          recordsPerPage: filters.recordsPerPage,
          searchValues,
        },
      })
      dispatch(saveLastSearch(filters))
      dispatch(saveOrdersPageResponse(serialized, response))
    })
  }
}

/* On click on submit from advancedSearch form */
export function advancedSearch(searchObj, pageDetails) {
  const serialized = JSON.stringify([searchObj, pageDetails])
  return (dispatch) => {
    return fetchAdvancedSearchOrder(searchObj, pageDetails).then(response => {
      dispatch({
        type: GET_ADVANCED_SEARCH,
        payload: {
          ...response,
          recordsPerPage: pageDetails.recordsPerPage,
          sortOrder: pageDetails.sortOrder,
          sortBy: pageDetails.sortBy,
          searchValues: searchObj,
        },
      })
      const filters = [searchObj, pageDetails]
      dispatch(saveLastSearch(filters))
      dispatch(saveOrdersPageResponse(serialized, response))
    })
  }
}

export function simplifiedSearch(searchObj, pageDetails) {
  return (dispatch) => {
    return fetchSimplifiedSearchOrder(searchObj).then(response => {
      dispatch({
        type: GET_ADVANCED_SEARCH,
        payload: {
          ...response,
          recordsPerPage: pageDetails.recordsPerPage,
          sortOrder: pageDetails.sortOrder,
          sortBy: pageDetails.sortBy,
          searchValues: searchObj,
        },
      })
    })
  }
}

export function serialzeAdvancedSearchDateAndCache(dispatch, pageDetails, pageOrders, searchObj) {
  dispatch({
    type: GET_ADVANCED_SEARCH,
    payload: {
      ...pageOrders,
      recordsPerPage: pageDetails.recordsPerPage,
      sortOrder: pageDetails.sortOrder,
      sortBy: pageDetails.sortBy,
      searchValues: searchObj,
    },
  })
}

export function getGenericOrderSearch(searchObj, searchFilters) {
  const serialized = JSON.stringify([searchObj, searchFilters])
  return (dispatch, getState) => {
    const searchOrder = selector_searchOrdersPagination(getState())
    const pageOrders = searchOrder[serialized]
    if (pageOrders) {
      return Promise.resolve(
        dispatch({
          type: GET_GENERICORDER_SEARCH,
          payload: {
            ...pageOrders,
            searchType: searchFilters.searchType,
            authType: searchFilters.authType,
            searchValues: searchObj,
          },
        })
      )
    }
    return fetchGenericOrder(searchObj).then(data => {
      dispatch({
        type: GET_GENERICORDER_SEARCH,
        payload: {
          ...data,
          searchType: searchFilters.searchType,
          authType: searchFilters.authType,
          searchValues: searchObj,
        },
      })
      const filters = [searchObj]
      dispatch(saveLastSearch(filters))
      dispatch(saveOrdersPageResponse(serialized, data))
    })
  }
}

export function getRegionsByBillTo() {
  return dispatch =>
    fetchRegionsByBillTo().then(data => {
      dispatch({
        type: GET_REGIONS_BYBILLTO,
        payload: data,
      })
    })
}

export function getHierarchyTreeDropDown() {
  return dispatch =>
    fetchHierarchyTreeDropDown().then(data => {
      dispatch({
        type: GET_HIERARCHYTREE_DROPDOWN,
        payload: data,
      })
    })
}
