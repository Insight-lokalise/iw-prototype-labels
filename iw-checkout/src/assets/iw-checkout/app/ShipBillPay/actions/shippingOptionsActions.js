import get from 'lodash-es/get'

import {
    SAVE_SHOPPING_REQUEST_CARRIER,
    GET_THIRD_PARTY_CARRIERS,
    GET_SHIPPING_CARRIERS,
    GET_SAVED_SHIPPING_OPTIONS,
    GET_SHOPPING_REQUEST_TAX_EWR_FEE,
} from '../constants'

import {
    fetchShippingCarriers,
    fetchThirdPartyCarriers,
    updateCarrierDefault as _updateCarrierDefault,
} from '../../../libs/models/Shipping/shipping'

import {
    selector_isB2BUser,
} from '../../../libs/User/selectors'

import {
    fetchShoppingRequestShippingOptions,
    saveCarrierToShoppingRequest as _saveCarrierToShoppingRequest,
} from '../../../libs/models/Address/shippingAddresses'
import { fetchTaxAndEWRFee } from '../../../libs/models/ShoppingRequest'
import { selector_shoppingRequestEWRFee } from '../../../libs/ShoppingRequest/selectors'
import { getCart } from '../../../libs/businessContainerApps/cart/actions'

export function getShippingCarriers() {
    return {
        type: GET_SHIPPING_CARRIERS,
        payload: fetchShippingCarriers(),
    }
}

export function getThirdPartyCarriers() {
    return {
        type: GET_THIRD_PARTY_CARRIERS,
        payload: fetchThirdPartyCarriers(),
    }
}

export function saveCarrierToShoppingRequest(options) {
    return {
        type: SAVE_SHOPPING_REQUEST_CARRIER,
        payload: _saveCarrierToShoppingRequest(options),
    }
}

export function getShoppingRequestShippingOptions() {
    return {
        type: GET_SAVED_SHIPPING_OPTIONS,
        payload: fetchShoppingRequestShippingOptions(),
    }
}

export function updateCarrierDefault(carrierId) {
    return (dispatch) => {
        _updateCarrierDefault(carrierId)
        .then(()=>{
            dispatch(getShippingCarriers())
        })
        .then(()=>{
            dispatch(getThirdPartyCarriers())
        })
    }
}

export function getTaxAndEWRFee() {
    return (dispatch, getState) => {
        const payload = fetchTaxAndEWRFee().then((result) => {
            const currentEWR = selector_shoppingRequestEWRFee(getState())
            const isB2BUser = selector_isB2BUser(getState())
            const nextEWR = get(result, ['cart', 'summary', 'ewrFee'], currentEWR)
            if (currentEWR !== nextEWR && !isB2BUser) {
                dispatch(getCart())
            }
            return result
        })

        return dispatch({
            type: GET_SHOPPING_REQUEST_TAX_EWR_FEE,
            payload,
        })
    }
}
