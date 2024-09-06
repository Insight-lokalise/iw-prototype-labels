import get from 'lodash-es/get'

import * as constants from '../constants'
import { saveSPLAUsage as _saveSPLAUsage } from '../../../models/Cart/usageReporting'
import { saveRequestorGroupId, transformCart } from '../../../models/Cart'
import { getCart } from '../../cart/actions'

export function saveSPLAUsage(dateToReport) {
  return (dispatch) => {
    return _saveSPLAUsage(dateToReport).then(() =>
      dispatch({
        type: `${constants.SAVE_SPLA_USAGE}_FULFILLED`,
        payload: dateToReport,
      })
    )
  }
}

export function action_saveRequestorGroupId(requestorGroupId, requestorGroup) {
  return (dispatch, getState) => {
    const state = getState()
    const hasSavedRequestorGroupAutomatically = get(
      state,
      ['shoppingCartView', 'hasSavedRequestorGroupAutomatically'],
      false
    )
    if (!hasSavedRequestorGroupAutomatically) {
      saveRequestorGroupId(requestorGroupId, requestorGroup)
        .then(() => dispatch(getCart()))
        .catch((error) => {
          console.log(error)
          dispatch({
            type: `${constants.RECEIVE_CART_RESPONSE}_REJECTED`,
          })
        })
    }
  }
}

export function setHasSavedRequestorGroupAutomatically() {
  return {
    type: constants.SET_HAS_SAVED_REQUESTOR_GROUP_AUTOMATICALLY,
    payload: true,
  }
}

export const transformCartAction = () => {
  return (dispatch) => {
    return transformCart().then((data) => {
      dispatch({
        type: `${constants.TRANSFORM_CART_RESPONSE}_FULFILLED`,
        payload: data,
      })
    })
  }
}

export const setDigitalDataCheckoutType = (digitalDataCheckoutType) => {
  return {
    type: constants.SET_DIGITAL_DATA_CHECKOUT,
    payload: { digitalDataCheckoutType },
  }
}
