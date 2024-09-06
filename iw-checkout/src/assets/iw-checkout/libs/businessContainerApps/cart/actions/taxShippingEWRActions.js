import * as Cart from './../../../models/Cart'
import * as constants from './../../../Cart/constants'
import { selector_user } from './../../../User/selectors'
import { selector_insight } from './../../../Insight/selectors'
import { selector_shoppingRequestShipping } from './../../../ShoppingRequest/selectors'
import { setCartIsPending } from './cartActions'

export function updateShippingCost(cart) {
    return (dispatch, getState) => {
        const currentState = getState()
        const userFromState = selector_user(currentState)
        const insightFromState = selector_insight(currentState)
        const shippingAddressFromShoppingRequest = selector_shoppingRequestShipping(currentState)
        const defaultShippingAddress = Object.keys(shippingAddressFromShoppingRequest).length > 0 ?
                                       shippingAddressFromShoppingRequest : userFromState.defaultShippingAddress
        // no need for calculate shipping for empty cart and non-shipable
        // items in cart, but what about tax in case of non-shipable
        if (userFromState.isLoggedIn && (cart.totalCount > 0)) {
            const webGroupPermissionsFromState = userFromState.webGroupPermissions || []
            const body = Object.assign({}, {
                cart,
                locale: insightFromState.locale,
                showEWR: (webGroupPermissionsFromState.indexOf('ewr_fees_in_cart') > -1),
                showShippingEstimate: (webGroupPermissionsFromState.indexOf('frt_estimator') > -1),
                defaultCarrier: userFromState.defaultCarrier,
                defaultShippingAddress: defaultShippingAddress, // Get shipTo from selected shipping if any else get it from default shipping address when user comes from return to cart
                isEMEA: userFromState.isEMEA,
            })
            dispatch(setCartIsPending())
            return Cart.fetchFreightForCartIfWeShould(body)
                .then(nextCart => {
                    body.cart = nextCart
                    dispatch({
                        type: constants.UPDATE_SHIPPING,
                        payload: nextCart,
                    })
                    return dispatch(updateTAXandEWR(body))
                })
                .catch(err => {
                    console.log(err)
                    // even if shipping fails, we can go and fetch TAX and EWR
                    // it could be better if we fure TAX and EWR seperate, but
                    // is calculated on updated cart, so we need to wait for shipping call
                    return dispatch(updateTAXandEWR(body))
                })
        }
        return Promise.resolve()
    }
}

export function updateTAXandEWR(body) {
    return {
        type: constants.UPDATE_TAX_EWR_SHIPPING,
        payload: Cart.fetchTaxEWRIfWeShould(body)
            .then((nextCart) => {
                Cart.updateMiniCart()
                return nextCart
            })
            .catch(err => {
                Cart.updateMiniCart()
                console.warn('Error updating Tax and EWR fees:', err)
            }),
    }
}
