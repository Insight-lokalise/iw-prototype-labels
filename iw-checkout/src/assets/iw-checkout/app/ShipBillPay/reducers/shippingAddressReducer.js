import get from 'lodash-es/get'
import {
    GET_FAVORITE_SHIPPING_ADDRESSES,
    SELECT_SHIPPING_ADDRESS,
    CREATE_SHIPPING_ADDRESS,
    PROP_COMPLIANCE,
} from './../constants'

export function shippingAddressSection(state = {}, { type, payload }) {
    switch (type) {
        case `${GET_FAVORITE_SHIPPING_ADDRESSES}_FULFILLED`: {
            return {
                ...state,
                favoriteAddresses: payload,
            }
        }
        case SELECT_SHIPPING_ADDRESS: {
            return {
                ...state,
                selectedAddress: payload,
            }
        }
        case `${PROP_COMPLIANCE}_FULFILLED`: {
            return {
                ...state,
                p65Warnings: payload,
            }
        }
        case `${CREATE_SHIPPING_ADDRESS}_PENDING`: {
            return {
                ...state,
                isPending: true,
            }
        }
        case `${CREATE_SHIPPING_ADDRESS}_FULFILLED`: {
            return {
                ...state,
                isPending: false,
                suggestedAddresses: payload.suggestedAddressesList,
            }
        }
        case `${CREATE_SHIPPING_ADDRESS}_REJECTED`: {
            return {
                ...state,
                isPending: false,
            }
        }
        default: return state
    }
}
