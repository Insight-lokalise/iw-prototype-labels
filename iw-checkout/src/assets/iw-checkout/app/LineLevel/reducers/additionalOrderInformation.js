import { combineReducers } from 'redux'
import { headerLevelSmartTrackers } from './headerLevelSmartTrackers'
import { populateUIFlags } from './populateUIFlagsReducers'

export const additionalOrderInformation = combineReducers({
    headerLevelSmartTrackers,
    populateUIFlags,
})
