import initialState from '../../config/initialState'
import {
  RECEIVE_RECENT_QUOTES_RESPONSE,
  RECEIVE_RECENT_ORDERS_RESPONSE,
  RECEIVE_RECENT_INVOICES_RESPONSE,
  RECEIVE_REQUESTOR_REQUISITIONS_RESPONSE,
  RECEIVE_APPROVER_REQUISITIONS_RESPONSE,
} from '../actionTypes'

export function recentQuotes(state = initialState.recentQuotes, { type, payload }) {
  switch (type) {
    case RECEIVE_RECENT_QUOTES_RESPONSE:
      return payload
    default:
      return state
  }
}

export function recentOrders(state = initialState.recentOrders, { type, payload }) {
  switch (type) {
    case RECEIVE_RECENT_ORDERS_RESPONSE:
      return payload
    default:
      return state
  }
}

export function recentInvoices(state = initialState.recentInvoices, { type, payload }) {
  switch (type) {
    case RECEIVE_RECENT_INVOICES_RESPONSE:
      return payload
    default:
      return state
  }
}

export function requestorRequisitions(state = initialState.requestorRequisitions, { type, payload }) {
  switch (type) {
    case RECEIVE_REQUESTOR_REQUISITIONS_RESPONSE:
      return payload
    default:
      return state
  }
}

export function approverRequisitions(state = initialState.approverRequisitions, { type, payload }) {
  switch (type) {
    case RECEIVE_APPROVER_REQUISITIONS_RESPONSE:
      return payload
    default:
      return state
  }
}
