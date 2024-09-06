import InitialState from '../../libs/initialState'
import { getShipEstimate } from './../../../libs/Cart/selectors'
import * as constants from './../../libs/constants';

export function shippingEstimator(state = getShipEstimate(InitialState), action) {
    switch (action.type) {
        case `${constants.GET_SHIP_ESTIMATE}_FULFILLED`:
            return {
                ...state,
                shippingOptions: action.payload,
                isDialogVisible: true,
                isPending: false,
            }
        case `${constants.GET_SHIP_ESTIMATE}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case `${constants.GET_SHIP_ESTIMATE}_REJECTED`:
            return {
                ...state,
                isPending: false,
                isDialogVisible: false,
            }
        case `${constants.UPDATE_ZIPCODE}`:
            return {
                ...state,
                zipcode: action.payload,
            }
        case `${constants.SHOW_DIALOG_SHIP_OPTIONS}`:
            return {
                ...state,
                isDialogVisible: action.payload,
            }
        default: return state
    }
}
