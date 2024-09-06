import { get, post } from './../fetch/fetch'

import { normalizeToPurchaseOrderAddress } from './../Address/address'

export function fetchFavoriteBillingAddresses() {
    return get('billing/favorites')
}

export function saveBillingAddressToShoppingRequest(address) {
    // do not save notes or id to ShoppingRequest.billing
    const { notes, ...normalizedAddress } = normalizeToPurchaseOrderAddress(address) // eslint-disable-line no-unused-vars
    return post('shoppingRequest/billing', normalizedAddress)
}

export function updateBillingAddressDefault(addressId) {
    return post('billing/default', { id: addressId }, { json:false } )
    .then( (response) => {
        if (response.ok) {
            return {
                addressId: addressId,
            }
        }
    })
    .catch((error) => {
        console.warn('Failed to update billing address to default')
        throw error // re-throw error for initial testing of functionality
    })
}

