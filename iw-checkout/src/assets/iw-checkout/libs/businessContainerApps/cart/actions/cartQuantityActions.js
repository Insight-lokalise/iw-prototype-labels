/**
 * NOTE I'm not a huge fan of the pattern here, look for other solutions.
 * @param  {[type]} updates [description]
 * @return {Object<FSAction>}         [description]
 */
import { processCartUpdatesGAE } from '@insight/toolkit-utils/lib/analytics';
import * as Cart from './../../../models/Cart'
import * as constants from './../../../Cart/constants'
import { receiveCartResponse } from './cartActions'
import { selector_cart, selector_cartItemTentativeQuantities } from '../../../Cart/selectors/cartResponse';

export function updateItemQuantity({materialID, itemQuantity}) {
  return (dispatch, getState) => {
    const qtyToUpdate = selector_cartItemTentativeQuantities(getState())
    const itemToUpdate = qtyToUpdate.filter(item => item.materialID === materialID)
    itemToUpdate[0].quantity = itemQuantity
        dispatch({
            type: constants.UPDATE_CART_ITEM_QUANTITIES,
            payload: Cart.updateCart(itemToUpdate)
               .then(cart => {
                   const oldCart = selector_cart(getState())
                   processCartUpdatesGAE(cart, oldCart, itemToUpdate)
                   dispatch(receiveCartResponse(cart))
                   return cart
               }),
        })
    }
}

export function updateCartItemQuantities(updates) {
    return (dispatch, getState) => {
        dispatch({
            type: constants.UPDATE_CART_ITEM_QUANTITIES,
            payload: Cart.updateCart(updates)
               .then(cart => {
                   const oldCart = selector_cart(getState())
                   processCartUpdatesGAE(cart, oldCart, updates)
                   dispatch(receiveCartResponse(cart))
                   return cart
               }),
        })
    }
}

/**
 * Update the appropriate cartItemView's tentative quantity to store the value
 * before the user presses the button to update quantity.
 * @param  {Object} updateDetails of shape { contractId<String>,
 *                                  materialIDKey<String>,
 *                                  quantity<Number> }
 * @return {Object<FSAction>}               (Flux Standard Action)
 */
export function updateTentativeQuantity(updateDetails) {
    return {
        type: constants.UPDATE_TENTATIVE_CART_ITEM_QUANTITY,
        payload: updateDetails,
    }
}
