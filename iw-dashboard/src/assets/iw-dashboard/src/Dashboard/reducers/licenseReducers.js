import {
    EXISTS_ENTERPRISE_AGREEMENT_DETAILS,
    EXISTS_LICENSE_POSITION_BY_PUBLISHER,
    GET_ENTERPRISE_AGREEMENT_DETAILS,
    GET_LICENSE_POSITION_BY_PUBLISHER,
    SAVE_ENTERPRISE_AGREEMENT_DETAILS,
    SAVE_LICENSE_POSITION_BY_PUBLISHER,
} from '../actionTypes'

const initialState = { hasData: false }

export function licensePositionByPublisher(state = initialState, action) {
  switch (action.type) {
    case SAVE_LICENSE_POSITION_BY_PUBLISHER:
      return { ...state, hasData: true, data: action.payload }
    case GET_LICENSE_POSITION_BY_PUBLISHER:
      return { ...state, hasData: false, hasError: false }
    case EXISTS_LICENSE_POSITION_BY_PUBLISHER:
      return { ...state, hasData: true }
    default:
      return state
  }
}

export function enterpriseAgreementDetails(state = initialState, action) {
    switch (action.type) {
      case SAVE_ENTERPRISE_AGREEMENT_DETAILS:
        return {
          ...state,
          hasData: true,
          data: action.payload.data,
          options: action.payload.options
        }
      case GET_ENTERPRISE_AGREEMENT_DETAILS:
        return { ...state, hasData: false, hasError: false }
      case EXISTS_ENTERPRISE_AGREEMENT_DETAILS:
        return { ...state, hasData: true }
      default:
        return state
    }
}
