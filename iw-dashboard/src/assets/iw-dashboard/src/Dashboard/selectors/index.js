import get from 'lodash-es/get'

const emptyArray = Object.freeze([])

export const selector_recentQuotesData = state => state.recentQuotes
export const selector_recentOrdersData = state => state.recentOrders
export const selector_recentInvoicesData = state => state.recentInvoices

export const selector_requestorRequisitions = state => state.requestorRequisitions
export const selector_requestorDashletRequisitionHistoryResults = state =>
  get(selector_requestorRequisitions(state), 'dashletRequisitionHistoryResults', emptyArray)

export const selector_approverRequisitions = state => state.approverRequisitions
export const selector_approverDashletRequisitionHistoryResults = state =>
  get(selector_approverRequisitions(state), 'dashletRequisitionHistoryResults', emptyArray)
