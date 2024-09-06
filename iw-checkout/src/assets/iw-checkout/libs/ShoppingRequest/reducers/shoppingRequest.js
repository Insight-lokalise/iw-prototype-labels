import get from 'lodash-es/get'

import * as constants from './../constants'
import InitialState from './../../../app/libs/initialState'
import { selector_shoppingRequest } from './../selectors'

export function shoppingRequest(state = selector_shoppingRequest(InitialState), { type, payload }) {
    switch (type) {
        case `${constants.SAVE_SHOPPING_REQUEST_SHIPPING}_FULFILLED`:
            return {
                ...state,
                shipping: get(payload, 'shipping', payload),
            }
        case `${constants.SAVE_SHOPPING_REQUEST_BILLING_ADDRESS}_FULFILLED`:
            return {
                ...state,
                billing: payload,
            }
        case `${constants.GET_SHOPPING_REQUEST_TAX_EWR_FEE}_PENDING`:
            return {
                ...state,
                taxIsPending: true,
            }
        case `${constants.GET_SHOPPING_REQUEST_TAX_EWR_FEE}_FULFILLED`:
            return {
                ...state,
                ...payload,
                taxIsPending: false,
            }
        case `${constants.GET_SHOPPING_REQUEST}_FULFILLED`:
        case `${constants.TRANSLATE_CART_TO_SHOPPING_REQUEST}_FULFILLED`:
        case `${constants.PLACE_ORDER}_FULFILLED`:
        case `${constants.SAVE_SHOPPING_REQUEST_CARRIER}_FULFILLED`:
        case `${constants.TERMS_CONDITIONS}_FULFILLED`:
            return {
                ...state,
                ...payload,
            }
        default: return state
    }
}
