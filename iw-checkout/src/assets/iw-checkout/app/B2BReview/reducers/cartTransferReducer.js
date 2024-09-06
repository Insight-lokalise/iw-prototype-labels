import InitialState from '../../libs/initialState'
import * as constants from './../../libs/constants';
import { selector_cartTransfer, parseCommoditiesMap } from './../../../libs/Cart/selectors'

export function cartTransfer(state = selector_cartTransfer(InitialState), { type, payload }) {
    switch (type) {
        default: return state
        case `${constants.GET_TRANSFER_CART}_FULFILLED`:
            return {
                ...state,
                ...payload,
                commoditiesMap: parseCommoditiesMap(payload),
                isPending: false,
            }
        case `${constants.GET_TRANSFER_CART}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case `${constants.GET_TRANSFER_CART}_REJECTED`:
            return {
                ...state,
                isPending: false,
            }
    }
}
