import * as constants from './../constants'
import InitialState from './../../../app/libs/initialState'

export function cart(state = InitialState.cart, action) {
    switch (action.type) {
        case `${constants.RECEIVE_CART_RESPONSE}_FULFILLED`:
            return action.payload
        case constants.RECEIVE_CART_RESPONSE:
            return action.payload
        case `${constants.RECEIVE_CART_RESPONSE}_REJECTED`:
            return state
        case `${constants.UPDATE_SHIPPING}`:
            return {
                ...state,
                ...action.payload,
                isPending: false,
            }
        case `${constants.UPDATE_CART_PENDING_STATUS}`:
            return {
                ...state,
                isPending: action.payload,
            }
        case `${constants.UPDATE_TAX_EWR_SHIPPING}_REJECTED`:
            return {
                ...state,
                isPending: false,
            }
        case `${constants.UPDATE_TAX_EWR_SHIPPING}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case `${constants.UPDATE_TAX_EWR_SHIPPING}_FULFILLED`:
            return {
                ...state,
                ...action.payload,
                isPending: false,
            }
        default:
            return state
    }
}
