import initialState from '../../../app/libs/initialState'
import * as User from '../../models/User'
import * as constants from './../constants'
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../../../app/libs/constants'

export function loadUser() {
    return dispatch => {
        User.loadUser().then(user => {
            user.isEMEA = getRegion(INSIGHT_CURRENT_LOCALE_COOKIE_NAME) === 'EMEA';
            dispatch({
                type: constants.LOAD_USER,
                payload: user,
            })
        })
    }
}

export function getRequestorGroups(item) {
    const payload = User.getRequestorGroups(item)
        .catch((error) => initialState.user);
    return {
        type: constants.GET_REQUESTOR_GROUP,
        payload: payload,
    }
}
/**
 * getDefaultCarrier for user, currently not used in checkout flow as read from JSP
 * @return {[type]} [description]
 */
export function getDefaultCarrier() {
    return dispatch => {
        User.getDefaultCarrier()
          .then(carrier => {
              dispatch(receiveDefaultCarrierResponse(carrier))
          })
          .catch((error) =>{
              console.warn(error);
              dispatch({
                  type: `${constants.RECEIVE_DEFAULT_CARRIER}_REJECTED`,
              })
          })
    }
}

/**
 * getDefaultShippingAddress for user, currently not used in checkout
 * flow as read from JSP
 * @return {[type]} [description]
 */
export function getDefaultBillingAddress() {
    return dispatch => {
        User.getDefaultBillingAddress()
          .then(address => {
              dispatch(receiveDefaultBillingAddressResponse(address))
          })
          .catch((error) =>{
              console.warn(error);
              dispatch({
                  type: `${constants.RECEIVE_DEFAULT_BILLING_ADDRESS}_REJECTED`,
              })
          })
    }
}

/**
 * getDefaultShippingAddress for user, currently not used in checkout
 * flow as read from JSP
 * @return {[type]} [description]
 */
export function getDefaultShippingAddress() {
    return dispatch => {
        User.getDefaultShippingAddress()
        .then(address => {
            dispatch(receiveDefaultShippingAddressResponse(address))
        })
        .catch((error) =>{
            console.warn(error);
            dispatch({
                type: `${constants.RECEIVE_DEFAULT_SHIPPING_ADDRESS}_REJECTED`,
            })
        })
    }
}

export function receiveDefaultCarrierResponse(carrier) {
    return {
        type: constants.RECEIVE_DEFAULT_CARRIER,
        payload: carrier,
    }
}

export function receiveDefaultShippingAddressResponse(address) {
    return {
        type: constants.RECEIVE_DEFAULT_SHIPPING_ADDRESS,
        payload: address,
    }
}

export function receiveDefaultBillingAddressResponse(address) {
    return {
        type: constants.RECEIVE_DEFAULT_BILLING_ADDRESS,
        payload: address,
    }
}
