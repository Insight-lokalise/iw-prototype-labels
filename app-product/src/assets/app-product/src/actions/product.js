import { getProductInfo } from 'api'

// Define all the action type constants that are used in the action creators
// and the reducer functions.
export const FETCH_PRODUCT = 'FETCH_PRODUCT'
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT'
export const REQUEST_PRODUCT = 'REQUEST_PRODUCT'

/**
 * An async action creator that:
 *  1. Dispatches an action indicating that it's requested a product.
 *  2. Performs a service call to fetch the product info.
 *  3. Dispatches an action when the product info returns.
 */
export function fetchProduct(insightNumber) {
  return function (dispatch) {
    dispatch(requestProduct(insightNumber)) /* [1] */

    getProductInfo(insightNumber).then(product => { /* [2] */
      dispatch(receiveProduct(product)) /* [3] */
    })
  }
}

/**
 * This action is dispatched to indicate that the product information has
 * been requested.
 */
export function requestProduct(insightNumber) {
  return {
    type: REQUEST_PRODUCT,
    insightNumber,
  }
}

/**
 * This action is dispatched when the product information response has been
 * received from the product API.
 */
export function receiveProduct(product) {
  return {
    type: RECEIVE_PRODUCT,
    product,
  }
}


