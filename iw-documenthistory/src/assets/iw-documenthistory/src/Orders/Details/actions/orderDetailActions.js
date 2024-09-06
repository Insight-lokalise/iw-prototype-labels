import { CREATE_DUPLICATE_ORDER, GET_ORDER_DETAILS } from './../types'
import { createDuplicateOrder, getOrdersData } from '../../../models/OrderDetails/OrderDetails'

export function getOrderDetails(detailURL, orderNumber, soldTo) {
  return dispatch =>
    getOrdersData(detailURL, orderNumber, soldTo).then(data => {
      dispatch({
        type: GET_ORDER_DETAILS,
        payload: data,
      })
    }).catch(error => {
      if (error.response.status === 404) {
        window.location.href = "/insightweb/404"
      }
    })
}

export function duplicateOrder(orderNumber) {
  return dispatch =>
    createDuplicateOrder(orderNumber).then(data => {
      dispatch({
        type: CREATE_DUPLICATE_ORDER,
        payload: data,
      })
    })
}
