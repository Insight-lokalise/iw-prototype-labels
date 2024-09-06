import * as constants from './../constants'
import InitialState from './../../../app/libs/initialState'
import { selector_orderMetaData } from './../selectors'

export function orderMetaData(state = selector_orderMetaData(InitialState), { type, payload }) {
    switch (type) {
        case `${constants.GET_ORDER_METADATA}_FULFILLED`:
            return {
                ...state,
                ...payload,
            }
        case `${constants.UPDATE_ADDITIONAL_ORDER_INFORMATION}_FULFILLED`:
            return {
                ...state,
                ...payload,
            }
        case `${constants.UPLOAD_FILE}_FULFILLED`:
            return {
                ...state,
                file: {
                    ...payload,
                },
            }
        case `${constants.DELETE_FILE}_FULFILLED`:
            return {
                ...state,
                file: {},
            }
        case `${constants.UPLOAD_FILE}_PENDING`:
            return {
                ...state,
                file: {
                    isPending: true,
                },
            }

        default: return state
    }
}
