import {EXISTING_ENROLLMENT_IDS} from "../../businessContainerApps/cart/constants";

export function DEP(state = {}, { type, payload }) {
    switch (type) {
        case `${EXISTING_ENROLLMENT_IDS}_FULFILLED`:
            return {
                enrollmentInfo: payload,
           }
        default:
            return state
    }
}
