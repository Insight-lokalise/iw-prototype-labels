import { LOAD_INSIGHT_APPLICATION_DATA } from './../constants'

import InitialState from '../../../app/libs/initialState'

export default function insightApplicationData(state = InitialState.insightApplicationData, action) {
    switch (action.type) {
        case LOAD_INSIGHT_APPLICATION_DATA:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state
    }
}
