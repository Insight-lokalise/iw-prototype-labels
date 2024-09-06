import axios from 'axios'

export function retrieveLastUsage(programId, currentReportingMonth) {
    const soldTo = window.Insight.userInformation.soldto
    const previousZeroUsage = checkPreviousZeroUsage(soldTo,programId,currentReportingMonth)
    return previousZeroUsage
}

export function checkPreviousZeroUsage(soldTo,programId,currentReportingMonth) {
  const response = axios.get(`/insightweb/transaction/checkPreviousZeroUsage/${soldTo}/${programId}/true/${currentReportingMonth}`).catch(error => {
    console.warn('Failed to get previous zero usage', error)
    throw error
  });
  return response
}

export function recreateUsageCartData(programId, currentReportingMonth, enrollmentId) {
  const postObj = {
    data : {
      enrollmentId,
      name: 'programId',
      usagePeriod: currentReportingMonth,
      value: programId,
    }
  }
  return axios.post(`/insightweb/transaction/recreateUsageCartData`, postObj).catch(error => {
    console.warn('Failed to recreate cart data', error)
    throw error
  });
}

export function reportZeroUsage(programId, enrollmentId) {
  const postObj = {
    data : {
      enrollmentId,
      name: 'programId',
      value: programId,
      isRequestFromContractPage: true
    }
  }
  return axios.post(`/insightweb/transaction/reportZeroUsage`, postObj).catch(error => {
    console.warn('Failed to report zero usage', error)
    throw error
  });
}
