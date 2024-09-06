import InitialState from '../../libs/initialState'
import * as constants from './../../libs/constants';
import { selector_populateUIFlags } from './../selectors'

export function populateUIFlags(state = selector_populateUIFlags(InitialState), { type, payload }) {
    switch (type) {
        case `${constants.GET_TRANSACTION_FLAGS}_FULFILLED`:
            return payload
        default: return state
    }
}
