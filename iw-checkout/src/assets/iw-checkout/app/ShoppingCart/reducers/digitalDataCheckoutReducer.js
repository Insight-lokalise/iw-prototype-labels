import { SET_DIGITAL_DATA_CHECKOUT } from '../../../libs/businessContainerApps/cartSummary/constants'

export default function digitalDataCheckoutType(state = {}, { type, payload }) {
    switch (type) {
        default: return state
        case SET_DIGITAL_DATA_CHECKOUT:
            return {
                ...state,
              digitalDataCheckoutType: payload.digitalDataCheckoutType,
            }
    }
}
