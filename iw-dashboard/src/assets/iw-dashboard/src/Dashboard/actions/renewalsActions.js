import { EXISTS_UPCOMING_RENEWALS, GET_UPCOMING_RENEWALS, SAVE_UPCOMING_RENEWALS } from '../actionTypes'
import { UPCOMINGRENEWALS } from '../components/constants'
import { selector_prevAPICalls } from '../selectors/reportingSelectors'
import { fetchUpcomingRenewalsData } from '../../services'

export default function getRenewalsData() {
  return (dispatch, getState) => {
    if (selector_prevAPICalls(getState(), UPCOMINGRENEWALS).hasData) {
      dispatch({ type: EXISTS_UPCOMING_RENEWALS })
      return
    }
    dispatch({ type: GET_UPCOMING_RENEWALS })
    fetchUpcomingRenewalsData().then(response => {
      dispatch(saveRenewalsData(response.data.upcomingRenewals))
    })
  }
}

function saveRenewalsData(payload) {
  return {
    type: SAVE_UPCOMING_RENEWALS,
    payload,
  }
}
