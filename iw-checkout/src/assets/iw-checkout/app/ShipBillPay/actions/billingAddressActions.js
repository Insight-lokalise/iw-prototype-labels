import get from 'lodash-es/get'
import {initialize,} from 'redux-form'

import {getDefaultBillingAddress} from '../../../libs/User/actions'
import {createContactAddress} from './../../../libs/models/Address/address'
import {
    fetchFavoriteBillingAddresses,
    saveBillingAddressToShoppingRequest as _saveBillingAddressToShoppingRequest,
    updateBillingAddressDefault as _updateBillingAddressDefault,
} from './../../../libs/models/Address/billingAddresses'

import {
    CREATE_BILLING_ADDRESS,
    GET_FAVORITE_BILLING_ADDRESSES,
    SAVE_SHOPPING_REQUEST_BILLING_ADDRESS,
    SELECT_BILLING_ADDRESS,
} from './../constants'
import {BILLING_ADDRESS} from './../constants/SAPAddressConstants'
import {selector_addressSectionInitialValues} from './../selectors/addressSectionSelectors'
import {selector_selectedBillingAddress} from './../selectors/billingAddressSelectors'
import {selector_selectedShippingAddress} from './../selectors/shippingAddressSelectors'

export function getFavoriteBillingAddresses() {
    return {
        type: GET_FAVORITE_BILLING_ADDRESSES,
        payload: fetchFavoriteBillingAddresses().then(favAddresses =>
            get(favAddresses, 'shipToBillToaddress', [])
        ),
    }
}

export function selectBillingAddress(address) {
    return {
        type: SELECT_BILLING_ADDRESS,
        payload: address,
    }
}

export function createBillingAddress(address) {
    address.addressType = BILLING_ADDRESS
    return {
        type: CREATE_BILLING_ADDRESS,
        payload: createContactAddress(address),
    }
}

export function updateBillingAddressDefault(addressId) {
    return (dispatch) => {
        _updateBillingAddressDefault(addressId)
            .then(()=>{
                dispatch(getDefaultBillingAddress())
            })
    }
}


export function saveBillingAddressToShoppingRequest(address) {
    return {
        type: SAVE_SHOPPING_REQUEST_BILLING_ADDRESS,
        payload: _saveBillingAddressToShoppingRequest(address),
    }
}

/**
 * Clear the fields of billing's Add New section
 */
export function clearBillingAddNew() {
    return (dispatch, getState) => {
        const state = getState()
        const selectedBillingAddress = selector_selectedBillingAddress(state)
        const initialValues = selector_addressSectionInitialValues(state, selectedBillingAddress, {})
        return dispatch(initialize('BillingAddress', initialValues))
    }
}

/**
 * Copy the shipping address fields to billing's Add New section
 * @param  {[type]} addNewFieldsOnly Whether to select the add new fields or not. False
 *                                   clears the add new section while true populates the
 *                                   section with shipping address data.
 */
export function sameAsShipping(addNewFieldsOnly) {
    return (dispatch, getState) => {
        const state = getState()
        const selectedShippingAddress = selector_selectedShippingAddress(state)
        const initialValues = selector_addressSectionInitialValues(state, selectedShippingAddress, { addNewFieldsOnly })
        return dispatch(initialize('BillingAddress', initialValues))
    }
}
