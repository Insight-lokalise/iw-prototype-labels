import { EXISTS_UPCOMING_RENEWALS, GET_UPCOMING_RENEWALS, SAVE_UPCOMING_RENEWALS } from '../actionTypes'

export default function upcomingRenewals(state = { hasData: false }, { type, payload }) {
  switch (type) {
    case GET_UPCOMING_RENEWALS:
      return { ...state, hasData: false }
    case SAVE_UPCOMING_RENEWALS:
      return { ...state, hasData: true, data: payload }
    case EXISTS_UPCOMING_RENEWALS:
      return { ...state, hasData: true }
    default:
      return state
  }
}
