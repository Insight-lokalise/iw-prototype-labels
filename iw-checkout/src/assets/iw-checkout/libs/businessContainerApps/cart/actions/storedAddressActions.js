import * as constants from '../../../sbp/constants'
import { fetchStoredAddress } from '../../../models/Products'

export function getStoredAddresses() {
    return dispatch => {
        dispatch({
            type: constants.GET_STORED_ADDRESS,
            payload: fetchStoredAddress()
                .then(address => {
                    return Object.assign({}, {
                        address,
                    })
                }),
        })
    }
}
