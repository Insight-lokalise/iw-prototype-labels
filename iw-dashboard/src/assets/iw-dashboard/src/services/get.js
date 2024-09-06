import axios from 'axios'

import { i18n, getCurrentLocale } from '@insight/toolkit-utils'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'

export function getTranslations() {
  const locale = getCurrentLocale('insight_current_locale', 'insight_locale')
  const isDebranded =
    window &&
    window.Insight &&
    window.Insight.b2bLoginInfo &&
    window.Insight.b2bLoginInfo.debrandSite
  return i18n({ app: 'app-dashboard', isDebranded, locale }).then((labels) =>
    setToolkitLabels(labels)
  )
}

export function fetchApproverRequisitions() {
  return axios.get('/insightweb/dashboard/dashlet/approver').catch((error) => {
    console.warn('Failed to fetch approver requisitions', error)
    throw error
  })
}

export function fetchDashboard() {
  return axios.get('/insightweb/dashboard/settings').catch((error) => {
    // return axios.get('https://fqphzkmorlpditxy4-mock.stoplight-proxy.io/insightweb/dashboard/settings').catch( error => {
    console.warn('Failed to fetch dashboard data', error)
    throw error
  })
}

export function fetchELDJumpUrl(jumpTo, jumpToParams) {
  const jumpObject = { jumpTo, jumpToParams }
  return axios
    .post(`/insightweb/redirectURLToELDSite`, jumpObject)
    .catch((error) => {
      console.warn('Failed to get ELD url.')
      throw error
    })
}

export function fetchEnterpriseAgreementDetails() {
  return axios.get(`/insightweb/getEADetailsByPublisher`).catch((error) => {
    console.warn('Failed to get enterprise agreement details.')
    throw error
  })
}

export function fetchLicensePositionByPublisher() {
  return axios
    .get(`/insightweb/getLicensePositionByPublisher`)
    .catch((error) => {
      console.warn('Failed to get license positions by publisher data.')
      throw error
    })
}

export function fetchPowerBIData(id) {
  return axios.get(`/insightweb/dashboard/dashlet/bi/${id}`).catch((error) => {
    console.warn('Failed to get PowerBI data.')
    throw error
  })
}
export function fetchRecentInvoices() {
  return axios.get('/insightweb/dashboard/dashlet/Invoice').catch((error) => {
    console.warn('Failed to fetch recent invoices', error)
    throw error
  })
}

export function fetchRecentOrders() {
  return axios.get('/insightweb/dashboard/dashlet/Order').catch((error) => {
    console.warn('Failed to fetch recent orders', error)
    throw error
  })
}

export function fetchRecentQuotes() {
  return axios.get('/insightweb/dashboard/dashlet/Quote').catch((error) => {
    console.warn('Failed to fetch recent quotes', error)
    throw error
  })
}

export function fetchRenewalsURL(
  manufacturer,
  prevOrderNo,
  clientPo,
  expiryDays
) {
  const fetchURL = `/insightweb/dueRenewals/${prevOrderNo ? 'quote' : 'all'}`
  const header = {
    manufacturer,
    prevOrderNo: `${prevOrderNo}`,
    clientPo,
    expiryDays,
  }
  return axios.post(fetchURL, header).catch((error) => {
    console.warn('Failed to get renewals URL')
    throw error
  })
}

export function fetchRequestorRequisitions() {
  return axios.get('/insightweb/dashboard/dashlet/requestor').catch((error) => {
    console.warn('Failed to fetch requestor requisitions', error)
    throw error
  })
}

export function fetchUpcomingRenewalsData() {
  return axios.get(`/insightweb/upcomingRenewals`).catch((error) => {
    console.warn('Failed to get upcoming renewals data')
    throw error
  })
}

export function fetchWelcomeData() {
  return axios.get('/insightweb/dashboard/dashlet/welcome').catch((error) => {
    console.warn('Failed to get Welcome data.')
    throw error
  })
}
