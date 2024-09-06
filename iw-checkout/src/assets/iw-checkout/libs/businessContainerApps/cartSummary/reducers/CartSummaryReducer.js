import * as constants from '../constants'

const cartSummary = (state = {}, action) => {
    switch (action.type) {
        // This occurs on receipt of requestor groups from the requestor group call in cart container.
        case `${constants.GET_REQUESTOR_GROUP}_FULFILLED`:
            const singlerg = action.payload && action.payload.requestorGroups && action.payload.requestorGroups.length === 1 && action.payload.requestorGroups[0] || null
            if (singlerg) {
                var newState = { ...state }
                return newState
            } else {
                return state
            }
        default:
            return state
    }
}

export default cartSummary
