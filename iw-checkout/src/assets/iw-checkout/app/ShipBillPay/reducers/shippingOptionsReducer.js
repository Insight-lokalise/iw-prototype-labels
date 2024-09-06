import InitialState from './../../libs/initialState'
import { selector_shippingOptionsSection } from './../selectors/shippingOptionsSelectors'
import {
    SAVE_SHOPPING_REQUEST_CARRIER,
    GET_THIRD_PARTY_CARRIERS,
    GET_SHIPPING_CARRIERS,
    GET_SAVED_SHIPPING_OPTIONS,
} from './../constants'

export function shippingOptionsSection(state = selector_shippingOptionsSection(InitialState), { type, payload }) {
    switch (type) {
        case `${GET_THIRD_PARTY_CARRIERS}_FULFILLED`:
            return {
                ...state,
                thirdPartyCarriers: payload,
            }
        case `${GET_SAVED_SHIPPING_OPTIONS}_FULFILLED`:
        case `${SAVE_SHOPPING_REQUEST_CARRIER}_FULFILLED`:
            return {
                ...state,
                savedShippingOptions: payload,
            }
        case `${GET_SHIPPING_CARRIERS}_FULFILLED`:
            return {
                ...state,
                shippingCarriers: payload,
            }
        default: return state
    }
}
