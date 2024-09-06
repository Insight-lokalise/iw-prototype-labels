import {
    GET_FAVORITE_BILLING_ADDRESSES,
    SELECT_BILLING_ADDRESS,
    CREATE_BILLING_ADDRESS,
} from './../constants'

export function billingAddressSection(state = {}, { type, payload }) {
    switch (type) {
        case `${GET_FAVORITE_BILLING_ADDRESSES}_FULFILLED`: {
            return {
                ...state,
                favoriteAddresses: payload,
            }
        }
        case SELECT_BILLING_ADDRESS: {
            return {
                ...state,
                selectedAddress: payload,
            }
        }
        case `${CREATE_BILLING_ADDRESS}_PENDING`: {
            return {
                ...state,
                isPending: true,
            }
        }
        case `${CREATE_BILLING_ADDRESS}_FULFILLED`: {
            return {
                ...state,
                isPending: false,
                suggestedAddresses: payload.suggestedAddressesList,
            }
        }
        case `${CREATE_BILLING_ADDRESS}_REJECTED`: {
            return {
                ...state,
                isPending: false,
            }
        }
        default: return state
    }
}
