import {
  RECEIVE_RECENT_QUOTES_RESPONSE,
  RECEIVE_RECENT_ORDERS_RESPONSE,
  RECEIVE_RECENT_INVOICES_RESPONSE,
  RECEIVE_REQUESTOR_REQUISITIONS_RESPONSE,
  RECEIVE_APPROVER_REQUISITIONS_RESPONSE,
} from '../actionTypes'
import {
  fetchRecentQuotes,
  fetchRecentOrders,
  fetchRecentInvoices,
  fetchRequestorRequisitions,
  fetchApproverRequisitions,
  postRequisitionStatusUpdate,
} from '../../services'

// used if response comes back 'null'
const emptyArray = Object.freeze([])
const emptyObject = Object.freeze({})

export function getRecentQuotes() {
  return dispatch => {
    fetchRecentQuotes().then(response => {
      dispatch({
        type: RECEIVE_RECENT_QUOTES_RESPONSE,
        payload: response.data.dashletDataList || emptyArray,
      })
    })
  }
}

export function getRecentOrders() {
  return dispatch => {
    fetchRecentOrders().then(response => {
      dispatch({
        type: RECEIVE_RECENT_ORDERS_RESPONSE,
        payload: response.data.dashletDataList || emptyArray,
      })
    })
  }
}

export function getRecentInvoices() {
  return dispatch => {
    fetchRecentInvoices().then(response => {
      dispatch({
        type: RECEIVE_RECENT_INVOICES_RESPONSE,
        payload: response.data.dashletDataList || emptyArray,
      })
    })
  }
}

export function getRequestorRequisitions() {
  return dispatch => {
    fetchRequestorRequisitions().then(response => {
      dispatch({
        type: RECEIVE_REQUESTOR_REQUISITIONS_RESPONSE,
        payload: response.data || emptyObject,
      })
    })
  }
}

export function getApproverRequisitions() {
  return dispatch => {
    fetchApproverRequisitions().then(response => {
      dispatch({
        type: RECEIVE_APPROVER_REQUISITIONS_RESPONSE,
        payload: response.data || emptyObject,
      })
    })
  }
}

export function updateRequisitionStatus(updateDashletRequisitionParams) {
  return dispatch => {
     return postRequisitionStatusUpdate(updateDashletRequisitionParams).then(response =>
      {
        dispatch({
        type:
          updateDashletRequisitionParams.status === 2
            ? RECEIVE_REQUESTOR_REQUISITIONS_RESPONSE
            : RECEIVE_APPROVER_REQUISITIONS_RESPONSE,
        payload: response.data || emptyObject,
      });
      return response.data;
    }
    )
  }
}
