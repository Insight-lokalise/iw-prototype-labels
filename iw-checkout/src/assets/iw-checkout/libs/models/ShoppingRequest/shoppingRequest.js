import { get, post } from '../fetch'

/**
 * [checkout this calls validation API and returns which section to show to user, it also populates
 * shopping request in session with current user defaults ]
 */
export function proceedToCheckout({source, quickCheckout}) {
    const timestamp = new Date().getTime()
    let URL = `checkout?_=${timestamp}`
    URL += quickCheckout !== null? `&quickCheckoutRequested=${quickCheckout}`:''
    URL += source !== null? `&source=${source}`:''
    return get(URL)
}

/**
 * Fetch session ShoppingRequest (new Cart pojo)
 */
export function getShoppingRequest() {
    const timestamp = new Date().getTime()
    return get(`shoppingRequest?_=${timestamp}`)
        .catch((error) => {
            console.warn('Failed to fetch Shopping request ', error)
            throw error // re-throw error for initial testing of functionality
        })
}


export function placeShoppingRequestOrder(data) {
    return post('order', data)
}

/**
 * Trigger the updating of the ShoppingRequests' tax and EWR information.
 * This call can take a very long time (minimum ~3 seconds, max > 1 min)
 */
export function fetchTaxAndEWRFee() {
    return post('taxAndEWRFee', {})
}

/**
 * Ask the backend to validate the ShoppingRequest we've created. Problem
 * description strings are returns in an array.
 * @return {Array<String>} List of human-readable errors. If none exist, returns []
 */
export function validateReviewOrder() {
    return post('reviewOrder', {})
}

export function getTermsAndConditions( termId,revisionId ) {
  return get(`tc/v1/term/${termId}/revision/${revisionId}`).catch((error) => {
    console.warn('Failed to fetch terms ', error)
    throw error
  })
}
