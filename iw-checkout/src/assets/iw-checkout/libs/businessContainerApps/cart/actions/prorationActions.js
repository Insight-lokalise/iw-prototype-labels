import * as constants from './../../../Cart/constants'
import * as Cart from './../../../models/Cart'
import { setCartIsPending, receiveCartResponse } from './cartActions'

/**
 * used to change the proration deploy date or to change the proration type (new, unused)
 * @param  {array} dateDetails array of objects, each of which have the following keys:
 *                              contractId, childMaterialIDKey, materialIDKey, proratableDate,
 *                              proratableMonth, proratableYear, proratableDateObject,
 *                              cartItemPurchaseType(optional)
 * @return {object}             cart response with changed date/type
 */
export function saveProrationUsageDate(dateDetails) {
    return dispatch => {
        dispatch(setCartIsPending())
        Cart.saveProrationUsageDate(dateDetails)
            .then(cart => {
                dispatch(receiveCartResponse(cart))
            })
            .catch((error) =>{
                console.log(error)
                dispatch({
                    type: `${constants.RECEIVE_CART_RESPONSE}_REJECTED`,
                })
            })
    }
}
