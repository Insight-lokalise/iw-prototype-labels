import InitialState from '../../libs/initialState'
import { selector_quickCheckoutObject } from './../../../libs/Cart/selectors'

const SET_QUICK_CHECKOUT = 'SET_QUICK_CHECKOUT'
const PROCEED_TO_CHECKOUT = 'PROCEED_TO_CHECKOUT'

export default function isQuickCheckout(state = selector_quickCheckoutObject(InitialState), { type, payload }) {
    switch (type) {
        case SET_QUICK_CHECKOUT:
            return {
                ...state,
                quickCheckout: payload,             
            }
        case `${PROCEED_TO_CHECKOUT}_FULFILLED`:
            return {
                ...state,
                quickCheckout: payload.quickCheckoutRequested || false,
                has500Error: false,
            }            
        case `${PROCEED_TO_CHECKOUT}_REJECTED`:
            const is500Error = (payload.statusCode == 500)
            return {
                ...state,
                has500Error: is500Error,
            }
        default: return state
    }
}
