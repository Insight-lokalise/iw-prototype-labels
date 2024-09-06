import * as constants from './../constants'
import InitialState from '../../../app/libs/initialState'

export default function user(state = InitialState.user, { type, payload }) {
    switch (type) {
        case `${constants.GET_USER}_FULFILLED`:
            return payload
        case `${constants.GET_USER}_REJECTED`:
            return state
        case constants.LOAD_USER:
            return {
                ...state,
                ...payload,
            }
        case `${constants.GET_REQUESTOR_GROUP}_FULFILLED`:
            var newstate = {
                ...state,
                requestorGroups: payload,
            }
            return newstate;
        case constants.RECEIVE_DEFAULT_CARRIER:
            return {
                ...state,
                defaultCarrier: payload,
            }
        case constants.RECEIVE_DEFAULT_SHIPPING_ADDRESS:
            return {
                ...state,
                defaultShippingAddress: payload,
            }
        case constants.RECEIVE_DEFAULT_BILLING_ADDRESS:
            return {
                ...state,
                defaultBillingAddress: payload,
            }
        case constants.USER_INFORMATION_UPDATED:
            return {
                ...state,
                userInformation: payload.userInformation
            }
        default:
            return state
    }
}
