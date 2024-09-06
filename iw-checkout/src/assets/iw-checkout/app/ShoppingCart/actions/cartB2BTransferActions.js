import * as constants from '../../libs/constants';
import { fetchTransferCart as transferCart } from '../../../libs/models/Cart'
import { getCart } from '../../../libs/businessContainerApps/cart/actions'

export function fetchTransferCart(payload) {
    return {
        type: constants.GET_TRANSFER_CART,
        payload: transferCart(payload),
    }
}

export function setIsB2BTransferPage(bool) {
    return (dispatch) => {
        dispatch({
            type: constants.DO_B2B_CHECKOUT,
            payload: bool,
        })
    }
}

export function triggerTransferCartAfterGetCart(b2bProps) {
    return dispatch => {
        dispatch(getCart())
        dispatch(fetchTransferCart(b2bProps))
    }
}
