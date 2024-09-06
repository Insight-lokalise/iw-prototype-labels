import InitialState from '../../libs/initialState'
import { selector_defaultShippingAddress } from '../selectors'
import * as constants from '../constants';
import get from 'lodash-es/get'

export function storedShippingAddresses(state = selector_defaultShippingAddress(InitialState), action) {
    switch (action.type) {
        case `${constants.GET_SHIPPING_STORED_ADDRESS}_FULFILLED`:
            return {
                ...state,
                defaultAddress: get(action.payload, 'shipResponse.defaultShipToBillTo', null),
                savedAddresses: get(action.payload, 'shipResponse.shipToBillToaddress', []),
                currentPage: get(action.payload, 'shipResponse.currentPage', 1),
                totalPages: get(action.payload, 'shipResponse.totalPages', 1),
                totalRecords: get(action.payload, 'shipResponse.totalRecords', 5),
                isDialogVisible: true,
                isPending: false,
            }
        case `${constants.GET_SHIPPING_STORED_ADDRESS}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case `${constants.GET_SHIPPING_STORED_ADDRESS}_REJECTED`:
            return {
                ...state,
                isPending: false,
                isDialogVisible: false,
            }
        case constants.UPDATE_SHIPPING_FAVORITE_NAME: {
            let partnerFunction = action.payload.partnerFunction
            let updatedFavoriteName = action.payload.favoriteName
            return Object.assign({}, state, {
                savedAddresses: state.savedAddresses.map(item => {
                    if (item.partnerFunction === partnerFunction) {
                        return Object.assign({}, item, {
                            favouriteName: updatedFavoriteName,
                        })
                    }
                    return item
                }),
            })
        }
        default: return state
    }
}
