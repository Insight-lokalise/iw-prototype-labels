import get from 'lodash-es/get'
import {initialize} from 'redux-form'
import {getDefaultShippingAddress} from '../../../libs/User/actions'
import {createContactAddress} from './../../../libs/models/Address/address'
import {
    deleteShippingAddressFromCart as _deleteShippingAddressFromCart,
    fetchFavoriteShippingAddresses,
    propCompliance,
    saveShippingAddressToCart,
    saveShippingAddressToShoppingRequest as _saveShippingAddressToShoppingRequest,
    updateShippingAddressDefault as _updateShippingAddressDefault,
} from './../../../libs/models/Address/shippingAddresses'
import {
    CREATE_SHIPPING_ADDRESS,
    DELETE_SHIPPING_ADDRESS_FROM_CART,
    GET_FAVORITE_SHIPPING_ADDRESSES,
    PROP_COMPLIANCE,
    SAVE_SHOPPING_REQUEST_SHIPPING,
    SELECT_SHIPPING_ADDRESS,
    UPDATE_SHIPPING_ADDRESS_TO_CART,
} from './../constants'
import {SHIPPING_ADDRESS} from './../constants/SAPAddressConstants'
import {selector_addressSectionInitialValues} from './../selectors/addressSectionSelectors'
import {selector_selectedShippingAddress} from './../selectors/shippingAddressSelectors'

export function getFavoriteShippingAddresses() {
    return {
        type: GET_FAVORITE_SHIPPING_ADDRESSES,
        payload: fetchFavoriteShippingAddresses()
            .then(favAddresses => get(favAddresses, 'shipToBillToaddress', []))
    }
}

export function selectShippingAddress(address) {
    return {
        type: SELECT_SHIPPING_ADDRESS,
        payload: address,
    }
}

export function updateShippingAddressToCart(address) {
    return {
        type: UPDATE_SHIPPING_ADDRESS_TO_CART,
        payload: saveShippingAddressToCart(address),
    }
}
export function updateShippingAddressDefault(addressId) {
    return (dispatch) => {
        _updateShippingAddressDefault(addressId)
        .then(()=>{
            dispatch(getDefaultShippingAddress())
        })
    }
}

export function deleteShippingAddressFromCart() {
    return {
        type: DELETE_SHIPPING_ADDRESS_FROM_CART,
        payload: _deleteShippingAddressFromCart(),
    }
}

export function createShippingAddress(address) {
    address.addressType = SHIPPING_ADDRESS

    return {
        type: CREATE_SHIPPING_ADDRESS,
        payload: createContactAddress(address),
    }
}

export function saveShippingAddressToShoppingRequest(address) {
    return {
        type: SAVE_SHOPPING_REQUEST_SHIPPING,
        payload: _saveShippingAddressToShoppingRequest(address),
    }
}

/**
 * Clear the fields of the Add New section
 */
export function clearShippingAddNew() {
    return (dispatch, getState) => {
        const state = getState()
        const selectedShippingAddress = selector_selectedShippingAddress(state)
        const initialValues = selector_addressSectionInitialValues(state, selectedShippingAddress, {})
        return dispatch(initialize('ShippingAddress', initialValues))
    }
}

export function prop65Compliance() {

    return {
        type: PROP_COMPLIANCE,
        payload: propCompliance(),
    }
}
