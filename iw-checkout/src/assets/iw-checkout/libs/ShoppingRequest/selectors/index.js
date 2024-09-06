import get from 'lodash-es/get'

export const selector_shoppingRequest = state => get(state, 'shoppingRequest', {})

export function selector_shoppingRequestShipping(state) {
    return selector_shoppingRequest(state).shipping || {}
}

export function selector_shoppingRequestBilling(state) {
    return selector_shoppingRequest(state).billing || {}
}

export function selector_shoppingRequestSummary(state) {
    return get(selector_shoppingRequest(state), ['cart', 'summary'], {})
}

export function selector_shoppingRequestEWRFee(state) {
    return get(selector_shoppingRequestSummary(state), 'ewrFee', 0)
}

export function selector_shoppingRequestShippingCost(state) {
    return get(selector_shoppingRequestSummary(state), 'shippingCost', 0)
}

export function selector_shoppingRequestGstHstTaxCost(state) {
    return get(selector_shoppingRequestSummary(state), 'gstHstTaxCost', 0)
}

export function selector_shoppingRequestPstTaxCost(state) {
    return get(selector_shoppingRequestSummary(state), 'pstTaxCost', 0)
}

export function selector_shoppingRequestCarrier(state) {
    return selector_shoppingRequestShipping(state).carrier || null
}

export function selector_hasSavedShippingCarrier(state) {
    return selector_shoppingRequestCarrier(state) !== null
}

export function selector_shoppingRequestTaxCost(state) {
    return get(selector_shoppingRequest(state), ['cart', 'summary', 'taxCost'], 0)
}

export function selector_shoppingRequestUser(state) {
    return get(selector_shoppingRequest(state), ['user'], {}) || {}
}

export function selector_shoppingRequestCart(state) {
    return get(selector_shoppingRequest(state), ['cart'], {}) || {}
}

export function selector_shoppingRequestCartItems(state) {
    return get(selector_shoppingRequestCart(state), ['cartItems'], []) || []
}

export function selector_shoppingRequestCartItemUsage(state) {
    const cartItems = selector_shoppingRequestCartItems(state)
    const firstCartItem = cartItems.length > 0 ? cartItems[0] : {}
    return get(firstCartItem, ['usage'], {})
}

export function selector_taxIsPending(state) {
    return get(selector_shoppingRequest(state), ['taxIsPending'], false)
}

export function selector_soldTo(state) {
    return get(selector_shoppingRequest(state), ['soldTo'], false)
}

export function selector_orderMetaData(state) {
    return get(selector_shoppingRequest(state), ['orderMetaData'], false)
}

export function selector_billing(state) {
    return get(selector_shoppingRequest(state), ['billing'], false)
}

export function selector_shipping(state) {
    return get(selector_shoppingRequest(state), ['shipping'], false)
}
