import * as ShippingEstimator from './../../../libs/models/Cart/shippingEstimator'
import * as constants from './../../libs/constants'
import { receiveCartResponse } from './../../../libs/businessContainerApps/cart/actions'

export function updateShippingCarrier(freight) {
    return dispatch => {
        ShippingEstimator.updateShippingCarrier(freight)
        .then(cart=>{
            dispatch(receiveCartResponse(cart))
        })
    }
}

export function getShippingEstimate(zipcode) {
    return dispatch => {
        dispatch({
            type: constants.GET_SHIP_ESTIMATE,
            payload: ShippingEstimator.getShippingEstimate(zipcode),
        })
        dispatch(updateZipcode(zipcode))
    }
}

export function updateZipcode(zipcode) {
    return {
        type: constants.UPDATE_ZIPCODE,
        payload: zipcode,
    };
}

export function openShippingOptionsDialog(flag) {
    return {
        type: constants.SHOW_DIALOG_SHIP_OPTIONS,
        payload: flag,
    };
}
