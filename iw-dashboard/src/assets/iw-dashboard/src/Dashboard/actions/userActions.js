/* eslint-disable import/prefer-default-export */
import { GET_USERDATA, SAVE_USERDATA } from '../actionTypes'

/**
 * Gets userData from JSP after waiting for it to be fully populated
 * @param  {Object}   userObject window.Insight
 * @return {Action}
 */
export function getUserData(userObject) {
  return dispatch => {
    dispatch({ type: GET_USERDATA })
    dispatch(awaitUserData(userObject, 200))
  }
}

function awaitUserData(response, counter) {
  return dispatch => {
    if (response.globalLabels || !counter) {
      dispatch(saveUserData(response))
    } else {
      window.setTimeout(() => {
        dispatch(awaitUserData(response, counter-1))
      })
    }
  }
}

/**
 * Save relevant user data & permissions
 * @param  {Object} userObject window.Insight when fully populated
 * @return {Action}
 */
function saveUserData(userObject) {
  const {
    b2bLoginInfo: { isB2BUser },
    locale,
    globalLabels,
    userInformation: { currencyCode, loginAsFlag, UserType, isCES }
  } = userObject
  const isDashboardLocked = !loginAsFlag && (isB2BUser || UserType === 'Shared')
  const userData = {
    currencyCode,
    isDashboardLocked,
    isLoading: false,
    locale,
    monthNames: [
      globalLabels.monthNamesJanShort,
      globalLabels.monthNamesFebShort,
      globalLabels.monthNamesMarShort,
      globalLabels.monthNamesAprShort,
      globalLabels.monthNamesMayShort,
      globalLabels.monthNamesJunShort,
      globalLabels.monthNamesJulShort,
      globalLabels.monthNamesAugShort,
      globalLabels.monthNamesSepShort,
      globalLabels.monthNamesOctShort,
      globalLabels.monthNamesNovShort,
      globalLabels.monthNamesDecShort,
    ],
    isCES,
  }
  return { type: SAVE_USERDATA, payload: userData }
}
