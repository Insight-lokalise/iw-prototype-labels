import { REPORT_ZERO_USAGE, GET_USAGE_REPORT_HISTORY, SAVE_SPLA_USAGE } from './../../libs/constants'

export default function usageReporting(state = {}, { type, payload }) {
    switch (type) {
        case `${GET_USAGE_REPORT_HISTORY}_FULFILLED`:
            return {
                ...state,
                ...payload,
            }
        case REPORT_ZERO_USAGE:
            return state
        case `${SAVE_SPLA_USAGE}_FULFILLED`:
            return {
                ...state,
            }
        default: return state
    }
}
