import * as constants from './../constants'
import * as ShoppingRequest from './../../models/ShoppingRequest'

export function getShoppingRequest() {
    return {
        type: constants.GET_SHOPPING_REQUEST,
        payload: ShoppingRequest.getShoppingRequest(),
    }
}

export function proceedToCheckout({source = null, quickCheckout = null}) {

    return {
        type: constants.PROCEED_TO_CHECKOUT,
        payload: ShoppingRequest.proceedToCheckout({source, quickCheckout}),
    }
}
