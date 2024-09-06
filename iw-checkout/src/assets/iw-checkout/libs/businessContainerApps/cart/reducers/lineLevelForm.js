import InitialState from '../../../../app/libs/initialState'
import {
	ADD_TO_READ_ONLY_FIELDS_MAP,
	CLEAR_FORM_SUBMISSION_STAGING,
	DECLARE_IS_SAVE_AS_QUOTE,
	DECLARE_ITEM_TO_SPLIT,
	INCREMENT_NUMBER_OF_STAGED_LINE_LEVEL_FORMS,
	RESET_NUMBER_OF_STAGED_LINE_LEVEL_FORMS,
	SET_LINE_LEVEL_FORM_SUBMISSION_FAILURE_STATUS,
	STAGE_LINE_LEVEL_FORM_DATA_FOR_SAVING,
} from '../constants'


export function lineLevelFormSubmissionFailed(state = InitialState.lineLevelView.lineLevelFormSubmissionFailed, { type, payload }) {
	switch (type) {
		case SET_LINE_LEVEL_FORM_SUBMISSION_FAILURE_STATUS:
			return payload
		default:
			return state
	}
}


export function formSubmissionStaging(state = InitialState.lineLevelView.formSubmissionStaging, { type, payload }) {
	let newState = {}
	switch (type) {
		case STAGE_LINE_LEVEL_FORM_DATA_FOR_SAVING:
			newState = Object.assign({}, state, { [payload.formName]: payload.formData })
			return newState
		case CLEAR_FORM_SUBMISSION_STAGING:
			return newState
		default:
			return state
	}
}


export function cartItemSelectedToSplit(state = InitialState.lineLevelView.cartItemSelectedToSplit, { type, payload }) {
	switch (type) {
		case DECLARE_ITEM_TO_SPLIT:
			return payload
		default:
			return state
	}
}


export function numberOfStagedLineLevelForms(state = InitialState.lineLevelView.numberOfStagedLineLevelForms, { type, payload }) {
	switch (type) {
		case INCREMENT_NUMBER_OF_STAGED_LINE_LEVEL_FORMS:
			return payload
		case RESET_NUMBER_OF_STAGED_LINE_LEVEL_FORMS:
			return payload
		default:
			return state
	}
}


export function readOnlyFieldsMap(state = InitialState.lineLevelView.readOnlyFieldsMap, { type, payload }) {
	switch (type) {
		case ADD_TO_READ_ONLY_FIELDS_MAP: {
			return {
				...state,
				...payload,
			}
		}
		default:
			return state
	}
}


export function isSaveAsQuote(state = InitialState.lineLevelView.isSaveAsQuote, { type, payload }) {
	switch (type) {
		case DECLARE_IS_SAVE_AS_QUOTE:
			return payload
		default:
			return state
	}
}
