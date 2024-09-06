import get from 'lodash-es/get'

import {
    selector_defaultBillingAddress,
    selector_hasEmptyBillingPermission,
    selector_hasEmptyShippingPermission,
    selector_isEMEA,
    selector_isLimitedUser,
} from './../../../libs/User/selectors'
import { selector_shoppingRequestBilling } from './../../../libs/ShoppingRequest/selectors'


export function selector_billingAddressSection(state) {
    return get(state, ['shipBillPayView', 'billingAddressSection'], {})
}

export function selector_favoriteBillingAddresses(state) {
    return get(selector_billingAddressSection(state), 'favoriteAddresses', [])
}

export function selector_selectedBillingAddress(state) {
    const defaultBillingAddress = selector_defaultBillingAddress(state) || {}
    const savedPurchaseOrderAddress = selector_shoppingRequestBilling(state)
    const selectedAddress = get(selector_billingAddressSection(state), 'selectedAddress', {})

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

    const fallbackAddress = canUseSavedAddress ? savedPurchaseOrderAddress : defaultBillingAddress
    return Object.keys(selectedAddress).length > 0 ? selectedAddress : fallbackAddress
}

export function selector_requireBillingAddressCreation(state) {
    return selector_hasEmptyBillingPermission(state) && !!selector_selectedBillingAddress(state).noDefault
}

//disable for EMEA limited user, otherwise check empty_billing user permission
export function selector_allowSameAsShipping(state) {
    return (selector_isEMEA(state) && selector_isLimitedUser(state)) ? false : selector_hasEmptyBillingPermission(state) && selector_hasEmptyShippingPermission(state)
}
