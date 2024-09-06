import { post, get, del } from '../fetch'

import {
    normalizeToPurchaseOrderAddress,
} from './../Address/address'

export function fetchFavoriteShippingAddresses() {
    return get('shipping/favorites')
}

export function fetchSavedShoppingRequestShipping() {
    const timestamp = new Date().getTime()
    return get(`shoppingRequest/shipping?_=${timestamp}`)
}

export function saveShippingAddressToCart(shippingAddress) {
    return post('transaction/shippingAddress', shippingAddress, { json: false })
}

export function deleteShippingAddressFromCart() {
    const timestamp = new Date().getTime()
    return del(`transaction/shippingAddress?_=${timestamp}`, { json: false })
}

export function saveShippingAddressToShoppingRequest(shippingData) {
    const normalizedAddress = normalizeToPurchaseOrderAddress(shippingData)
    return post('shipping', normalizedAddress)
}

export function saveCarrierToShoppingRequest(carrier) {
    return post('carrier', carrier)
}

export function fetchShoppingRequestShippingOptions() {
    return get('shoppingRequest/shipping')
}

export function updateShippingAddressDefault(addressId) {
    return post('shipping/default', { id: addressId }, { json:false } )
    .then( (response) => {
        if (response.ok) {
            return {
                addressId: addressId,
            }
        }
    })
    .catch((error) => {
        console.warn('Failed to update shipping address to default')
        throw error // re-throw error for initial testing of functionality
    })
}

export function propCompliance() {
    return post(`prop65Compliance`,{})
        .catch((error) => {
            throw error
        })
}

