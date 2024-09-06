import InitialState from '../../libs/initialState'
import * as constants from './../../libs/constants';
import { selector_headerLevelSmartTrackers } from './../selectors'

export function headerLevelSmartTrackers(state = selector_headerLevelSmartTrackers(InitialState), { type, payload }) {
    switch (type) {
        case `${constants.GET_HEADER_LEVEL_SMARTTRACKERS}_FULFILLED`:
            return payload.headerLevels
        case `${constants.UPDATE_HEADER_LEVEL_SMARTTRACKER_DEFAULTS}_FULFILLED`:
//          Clone the state
            const newState = Object.assign([], state);
//          Loop through the updates to the smart tracker defaults
            payload.userDefaults.forEach((update) => {
//              Apply the updates to the newState
                Object.values(newState).forEach(hlstd => {
                    if (hlstd.lineLevelId === update.configId) {
                        hlstd.preDefinedValue = update.defaultValue;
                    }
                });
            });
            return newState;
        default: return state
    }
}
