import get from 'lodash-es/get'

import {
    selector_defaultShippingAddress,
    selector_hasEmptyShippingPermission,
} from './../../../libs/User/selectors'
import { selector_shoppingRequestShipping } from './../../../libs/ShoppingRequest/selectors'

export function selector_shippingAddressSection(state) {
    return get(state, ['shipBillPayView', 'shippingAddressSection'], {})
}

export function selector_favoriteShippingAddresses(state) {
    return get(selector_shippingAddressSection(state), 'favoriteAddresses', [])
}

/**
 * If there is no selected address, fallback to the default shipping address
 * and otherwise fallback to an empty Object. Falling back to the default
 * shipping address is questionable because the User.defaultShippingAddress and
 * the SBPView.storedShippingAddresses.defaultAddress have a different shape
 * right now.
 */
export function selector_selectedShippingAddress(state) {
    const defaultShippingAddress = selector_defaultShippingAddress(state) || {}
    const savedPurchaseOrderAddress = selector_shoppingRequestShipping(state)
    const selectedAddress = get(selector_shippingAddressSection(state), 'selectedAddress', {})
    /**
     * If a user does not have a default shipTo and they have some EWR/Tax/Freight
     * Cost permission turned on, the backend ends up accidentally saving invalid
     * address information to the ShoppingRequest (some address fields end up
     * set to null). The preferred fix for this is on the backend but it is a
     * bit more involved than Chandra et al. want to tackle now so we will tackle
     * it during phase two. At which point we can remove this check.
     *
     * Reference: Rally defect 185
     */
    const canUseSavedAddress = Object.keys(savedPurchaseOrderAddress).length > 0 &&
        (savedPurchaseOrderAddress.address && savedPurchaseOrderAddress.address.address1 !== null)

    const fallbackAddress = canUseSavedAddress ? savedPurchaseOrderAddress : defaultShippingAddress
    return Object.keys(selectedAddress).length > 0 ? selectedAddress : fallbackAddress
}

export function selector_requireShippingAddressCreation(state) {
    return selector_hasEmptyShippingPermission(state) && !!selector_selectedShippingAddress(state).noDefault
}

export function selector_p65Warnings(state) {
    return get(selector_shippingAddressSection(state), 'p65Warnings', [])
}
