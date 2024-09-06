import {
    EXISTS_LICENSE_POSITION_BY_PUBLISHER,
    EXISTS_ENTERPRISE_AGREEMENT_DETAILS,
    GET_LICENSE_POSITION_BY_PUBLISHER,
    GET_ENTERPRISE_AGREEMENT_DETAILS,
    SAVE_LICENSE_POSITION_BY_PUBLISHER,
    SAVE_ENTERPRISE_AGREEMENT_DETAILS,
} from '../actionTypes'
import {
    selector_licensePositionByPublisher,
    selector_enterpriseAgreementDetails,
} from '../selectors/licenseSelectors'
import { selector_monthNames } from '../selectors/userSelectors'
import {
  fetchLicensePositionByPublisher,
  fetchEnterpriseAgreementDetails,
} from '../../services'

export function getLicensePositionByPublisher() {
    return (dispatch, getState) => {
        if(selector_licensePositionByPublisher(getState()).hasData) {
            dispatch({ type: EXISTS_LICENSE_POSITION_BY_PUBLISHER })
            return
        }
        dispatch({ type: GET_LICENSE_POSITION_BY_PUBLISHER })
        fetchLicensePositionByPublisher().then(response => {
          const results = response.data.getLicensePositionByPublisherResult
          const payload = results.status === 'Success' ? results.chart_items : { hasError: true }
          dispatch(saveLicensePositionByPublisher(payload))
        })
    }
}
function saveLicensePositionByPublisher(payload) {
    return {
        type: SAVE_LICENSE_POSITION_BY_PUBLISHER,
        payload,
    }
}

export function getEnterpriseAgreementDetails() {
    return (dispatch, getState) => {
        if(selector_enterpriseAgreementDetails(getState()).hasData) {
            dispatch({ type: EXISTS_ENTERPRISE_AGREEMENT_DETAILS })
            return
        }
        dispatch({ type: GET_ENTERPRISE_AGREEMENT_DETAILS })
        fetchEnterpriseAgreementDetails().then(response => {
          const results = response.data.getEADetailsByPublisherResult
          const payload = results.status === 'Success' ? results.chart_items : { hasError: true }
          dispatch(saveEnterpriseAgreementDetails(payload))
        })
    }
}
function saveEnterpriseAgreementDetails(response) {
  return (dispatch, getState) => {
    const monthList = selector_monthNames(getState())
    const data = response.map(entry => {
      const start_date = convertDate(entry.start_date, monthList)
      const end_date = convertDate(entry.end_date, monthList)
      return { ...entry, start_date, end_date }
    })
    const payload = {
      data,
      options: data.map((entry, index) => ({ value: index, label: entry.publisher }))
    }
    dispatch({
        type: SAVE_ENTERPRISE_AGREEMENT_DETAILS,
        payload,
    })
  }
}

function convertDate(initialDate, monthList) {
  const [ monthInitial, dayInitial, year ] = initialDate.split('/')
  const month = monthList[Number(monthInitial)-1].toUpperCase()
  const dayNumber = Number(dayInitial)
  const day = `${dayNumber < 10 ? '0' : ''}${dayNumber}`
  return `${day}-${month}-${year}`
}
