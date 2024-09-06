import { combineReducers } from 'redux'

import { additionalOrderInformation } from './additionalOrderInformation'
import {
    cartItemSelectedToSplit,
    formSubmissionStaging,
    isSaveAsQuote,
    lineLevelFormSubmissionFailed,
    numberOfStagedLineLevelForms,
    readOnlyFieldsMap,
} from '../../../libs/businessContainerApps/cart/reducers/lineLevelForm'

export const lineLevelView = combineReducers({
	additionalOrderInformation,
    cartItemSelectedToSplit,
    formSubmissionStaging,
    isSaveAsQuote,
    lineLevelFormSubmissionFailed,
    numberOfStagedLineLevelForms,
    readOnlyFieldsMap,
})
