import * as constants from '../constants'
import { fetchStoredAddress } from './../../../libs/models/Address/storedAddress'
import { updateAddressFavoriteName } from './../../../libs/models/Address/address'
import { getFavoriteShippingAddresses } from './shippingAddressActions'
import { getFavoriteBillingAddresses } from './billingAddressActions'

export function getStoredAddresses(searchObj) {
    const isShipping = searchObj.shipIndicator
    return {
        type: isShipping ? constants.GET_SHIPPING_STORED_ADDRESS : constants.GET_BILLING_STORED_ADDRESS,
        payload: fetchStoredAddress(searchObj),
    }
}

export function updateFavoriteName(addressObj) {
    return dispatch => {
        return updateAddressFavoriteName(addressObj)
            .then(response => {
                if (response != null && (response.Exception) && (response.Exception === 'DUPLICATE_EXISTS')) {
                    // display duplicate fav name error message
                } else {
                    const isShipping = addressObj.shipBillIndicator === 1
                    const action = isShipping ? getFavoriteShippingAddresses() : getFavoriteBillingAddresses()
                    dispatch({
                        type: isShipping ? constants.UPDATE_SHIPPING_FAVORITE_NAME : constants.UPDATE_BILLING_FAVORITE_NAME,
                        payload: addressObj,
                    })
                    dispatch(action)
                }
                return response
            })
    }
}
