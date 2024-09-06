import { change, destroy } from 'redux-form'
import get from 'lodash-es/get'
import {
	ADD_TO_READ_ONLY_FIELDS_MAP,
	ADD_ENROLLED_CHILD_ITEMS,
	CLEAR_FORM_SUBMISSION_STAGING,
	CONTRACT_SPECIFIC_INFORMATION_SECTION_NAME,
	DECLARE_IS_SAVE_AS_QUOTE,
	DECLARE_ITEM_TO_SPLIT,
	INCREMENT_NUMBER_OF_STAGED_LINE_LEVEL_FORMS,
	LICENSE_INFORMATION_SECTION_NAME,
	RESET_NUMBER_OF_STAGED_LINE_LEVEL_FORMS,
	SET_LINE_LEVEL_FORM_SUBMISSION_FAILURE_STATUS,
	SMARTTRACKER_SECTION_NAME,
	STAGE_LINE_LEVEL_FORM_DATA_FOR_SAVING,
} from '../constants'
import { selector_lineLevelFormNames } from '../selectors'
import { RECEIVE_CART_RESPONSE } from '../../../Cart/constants'
import {
	addToFromDataPayloadObject,
	createFormDataPayloadObject,
	createLineLevelFormSubmittalArray,
} from './lineLevelFormActionHelpers'
import { addToCartLineLevelReportingFields } from '../../../models/Cart/cart'
import { receiveCartResponse, clearCartItemInCartView } from './cartActions'
import { proceedToCheckout } from './../../../ShoppingRequest/actions'

export function clearFormSection({ parentFormName, sectionName }) {
	return (dispatch, getState) => {
		const listOfFieldsInFormSection = Object.keys(getState().form[parentFormName].values[sectionName])

		const readOnlyFieldsInFormSection = Object.assign(
			{},
			get(getState(), ['lineLevelView', 'readOnlyFieldsMap', parentFormName, sectionName], {})
		)

		listOfFieldsInFormSection.forEach(fieldName => {
			if (!readOnlyFieldsInFormSection[fieldName]) {
				dispatch(change(parentFormName, `${sectionName}.${fieldName}`, ''))
			}
		})
	}
}

export function copyFormSectionToAll({ parentFormName, sectionName }) {
	return (dispatch, getState) => {
		switch (sectionName) {
			case SMARTTRACKER_SECTION_NAME: {
				const listOfLineLevelForms = selector_lineLevelFormNames(getState())
				_changeFormSectionValues(
					dispatch,
					getState,
					parentFormName,
					SMARTTRACKER_SECTION_NAME,
					listOfLineLevelForms
				)
				break
			}
			case CONTRACT_SPECIFIC_INFORMATION_SECTION_NAME: {
				const contract = parentFormName.split('__')[1]
				const formNamesInContract = Object.keys(getState().form).filter(name =>
					name.startsWith(`lineLevelForm__${contract}`)
				)
				_changeFormSectionValues(
					dispatch,
					getState,
					parentFormName,
					CONTRACT_SPECIFIC_INFORMATION_SECTION_NAME,
					formNamesInContract
				)
				break
			}
			case LICENSE_INFORMATION_SECTION_NAME: {
				const listOfLineLevelForms = selector_lineLevelFormNames(getState())
				_changeFormSectionValues(
					dispatch,
					getState,
					parentFormName,
					LICENSE_INFORMATION_SECTION_NAME,
					listOfLineLevelForms
				)
				break
			}
			default:
				return null
		}
	}
}

function _changeFormSectionValues(dispatch, getState, parentFormName, sectionName, listOfFormsToCopyOver) {
	const parentFormState = getState().form[parentFormName]

	const selectedFormSectionValues = Object.assign({}, parentFormState.values[sectionName])

	const listOfSelectedFormSectionFields = Object.keys(parentFormState.registeredFields)
		.filter(name => name.startsWith(sectionName))
		.map(name => name.split('.')[1])

	const formSectionValuesToPropagate = Object.assign(
		{},
		listOfSelectedFormSectionFields.reduce((prev, curr) => {
			prev[curr] = ''
			return prev
		}, {}),
		selectedFormSectionValues
	)

	if (sectionName === LICENSE_INFORMATION_SECTION_NAME) {
		listOfFormsToCopyOver.forEach(formName => {
			let readOnlyFieldsOfReplacedForm = Object.assign(
				{},
				get(getState(), ['lineLevelView', 'readOnlyFieldsMap', formName, LICENSE_INFORMATION_SECTION_NAME], {})
			)
			listOfSelectedFormSectionFields.forEach(fieldName => {
				if (!readOnlyFieldsOfReplacedForm[fieldName]) {
					dispatch(change(formName, `${sectionName}.${fieldName}`, formSectionValuesToPropagate[fieldName]))
				}
			})
		})
	} else {
		listOfFormsToCopyOver.forEach(formName => {
			listOfSelectedFormSectionFields.forEach(fieldName => {
				dispatch(change(formName, `${sectionName}.${fieldName}`, formSectionValuesToPropagate[fieldName]))
			})
		})
	}
}

export function setLineLevelFormSubmissionFailureStatus(status) {
	return {
		type: SET_LINE_LEVEL_FORM_SUBMISSION_FAILURE_STATUS,
		payload: status,
	}
}

export function clearFormSubmissionStaging() {
	return {
		type: CLEAR_FORM_SUBMISSION_STAGING,
	}
}

export function stageLineLevelFormDataForSaving(values, props) {
	return (dispatch, getState) => {
		const {
			cartItemSelectedToSplit,
			formSubmissionStaging,
			numberOfStagedLineLevelForms,
		} = getState().lineLevelView

		dispatch(incrementNumberOfStagedLineLevelForms(numberOfStagedLineLevelForms + 1))

		const payload = props.bundledItem
			? addToFromDataPayloadObject(values, props, formSubmissionStaging)
			: createFormDataPayloadObject(values, props, cartItemSelectedToSplit)

		return dispatch({
			type: STAGE_LINE_LEVEL_FORM_DATA_FOR_SAVING,
			payload,
		})
	}
}

export function saveLineLevelFormData(routingFunction) {

	return (dispatch, getState) => {
		const emptyString = ''

		const {
			cartItemSelectedToSplit,
			formSubmissionStaging,
			isSaveAsQuote,
			lineLevelFormSubmissionFailed,
			numberOfStagedLineLevelForms,
		} = getState().lineLevelView

		const { cartViewByContractsAndMaterialIDKey } = getState().cartView

		const isSplit = cartItemSelectedToSplit !== emptyString

		const numberOfLineLevelForms = Object.keys(getState().form).filter(name => name.startsWith('lineLevelForm__'))
			.length

		const shouldSaveLineLevelFormData =
			!lineLevelFormSubmissionFailed && numberOfLineLevelForms === numberOfStagedLineLevelForms

		// Only actually dispatch action if submission is successful
		if (shouldSaveLineLevelFormData) {
			const lineLevelFormSubmittalArray = createLineLevelFormSubmittalArray(
				Object.assign({}, formSubmissionStaging), cartViewByContractsAndMaterialIDKey
			)
			return addToCartLineLevelReportingFields(lineLevelFormSubmittalArray)
				.then(cart => {
					return dispatch(receiveCartResponse(cart))
				})
				.catch(error => {
					console.log(error)
					dispatch({
						type: `${RECEIVE_CART_RESPONSE}_REJECTED`,
					})
				})
				.then(() => {
					return isSplit
						? dispatch(destroyAssociatedFormsAndClearItemFromCartView(cartItemSelectedToSplit))
						: isSaveAsQuote
							? window.location.assign('/insightweb/displaysavequote')
							: dispatch(proceedToCheckout({source:'LINELEVEL'})).then(routingFunction)
				})
		}
	}
}

export function destroyAssociatedFormsAndClearItemFromCartView(cartItemSelectedToSplit) {
	const cartItemSelectedToSplitArray = cartItemSelectedToSplit.split('__')
	// index 2 represents bundle material ID key, it will be '0' for regular cart items
	// if not bundle pick value at 3rd position as it represents materialIDKey of regualr item
	const contractID = cartItemSelectedToSplitArray[1]
	const isBundle = cartItemSelectedToSplitArray[2] !== '0'
	const materialIDKey = isBundle ? cartItemSelectedToSplitArray[2] : cartItemSelectedToSplitArray[3]
	return (dispatch, getState) => {
		const state = getState()
		const lineLevelFormNames = selector_lineLevelFormNames(state)
		const associatedFormsTest = cartItemSelectedToSplitArray.slice(0, -1).join('__')
		const associatedForms = isBundle
			? // find all forms that are in the same bundle as the form that initiated the split action
				lineLevelFormNames.filter(name => name.startsWith(associatedFormsTest))
			: [cartItemSelectedToSplit]
		associatedForms.forEach(associatedForm => dispatch(destroy(associatedForm)))
		dispatch(
			clearCartItemInCartView({
				contractID,
				materialID: materialIDKey,
			})
		)
	}
}

export function incrementNumberOfStagedLineLevelForms(number) {
	return {
		type: INCREMENT_NUMBER_OF_STAGED_LINE_LEVEL_FORMS,
		payload: number,
	}
}

export function resetNumberOfStagedLineLevelForms() {
	return {
		type: RESET_NUMBER_OF_STAGED_LINE_LEVEL_FORMS,
		payload: 0,
	}
}

export function declareItemToSplit(associatedForm) {
	return {
		type: DECLARE_ITEM_TO_SPLIT,
		payload: associatedForm,
	}
}

export function addToReadOnlyFieldsMap(mapPiece) {
	return {
		type: ADD_TO_READ_ONLY_FIELDS_MAP,
		payload: mapPiece,
	}
}

export function declareIsSaveAsQuote(boolValue) {
	return {
		type: DECLARE_IS_SAVE_AS_QUOTE,
		payload: boolValue,
	}
}

export function updateChildItems(enrolledDetails) {
	return {
		type: ADD_ENROLLED_CHILD_ITEMS,
		payload: enrolledDetails,
	}
}
