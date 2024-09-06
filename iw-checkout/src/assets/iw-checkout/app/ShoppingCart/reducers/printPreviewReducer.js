import { TOGGLE_PRINT_PREVIEW } from '../../../libs/businessContainerApps/orderUtilities/constants'

export default function printPreview(state = {}, { type, payload }) {
    switch (type) {
        default: return state
        case TOGGLE_PRINT_PREVIEW:
            return {
                ...state,
                isOpen: payload.isOpen,
            }
    }
}
