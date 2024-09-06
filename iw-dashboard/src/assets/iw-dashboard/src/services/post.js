import axios from 'axios'

export function postRequisitionStatusUpdate(updateDashletRequisitionParams) {
  return axios.post('ar/updateDashletRequisition', updateDashletRequisitionParams).catch(error => {
    console.warn('Failed to update requisition status', error)
    throw error
  })
}

export function postInvalidPartsAndCreditCard(params) {
  return axios.post('ar/checkInvalidPartsAndCreditCardExists', params).catch(error => {
    console.warn('Failed to check for invalid parts and missing credit card', error)
    throw error
  })
}

export function fetchReportingData(fetchPath) {
  return axios.get(`/insightweb/dashboard/${fetchPath}`, { credentials: 'include' }).catch(error => {
    console.warn('Failed to get reporting data')
    throw error
  })
}

export function postDashboardSettings(dashboardSettings) {
  return axios.put(`/insightweb/dashboard/settings`, dashboardSettings, { credentials: 'include' }).catch(error => {
    console.warn('Failed to save dashboard settings')
    throw error
  })
}
