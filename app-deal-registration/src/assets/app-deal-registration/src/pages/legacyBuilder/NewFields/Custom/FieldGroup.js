import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from '@insight/toolkit-react'
import {
	clearInputError,
	removeInput,
	setInputError,
	updateInput
} from 'state/modules/builder'
import { setModalClosed, setModalOpen } from 'state/newModules/shared'

import { DROPDOWN_TYPES } from '../constants'
import { BasicFields, OptionalFields } from '../FieldComponents'

export class FieldGroup extends Component {
	checkForInputErrors = name => {
		return this.props.inputError.includes(name)
	}

	handleInputError = (error, name) => {
		const { clearInputError, inputError, inputId, setInputError } = this.props
		if (error && !inputError.includes(name)) {
			setInputError({ inputId, name })
		} else if (!error && inputError.includes(name)) {
			clearInputError({ inputId, name })
		}
	}

	removeInput = () => {
		const { inputId, removeInput, removePrompt, setModalClosed, setModalOpen } = this.props
		if (!removePrompt) {
			removeInput(inputId)
		} else {
			setModalOpen({
				modalType: 'CONFIRM_INPUT_DELETE_MODAL',
				modalProps: {
					confirmDelete: () => removeInput(inputId),
					onClose: setModalClosed
				}
			})
		}
	}

	updateField = (name, value, error, path) => {
		const { input, inputId, nonUniqueIds, uniqueIds, updateInput } = this.props

		let actualName = path || name
		let hasUniqueId = false
		if (nonUniqueIds.length > 0 && nonUniqueIds.includes(inputId) && name === 'name') {
			hasUniqueId = !uniqueIds.includes(value)
		}

		updateInput({ hasUniqueId, inputId, name, value })
		this.handleInputError(error, actualName)
	}

	render() {
		const { input, inputId, nonUniqueIds, removeEnabled, uniqueIds } = this.props
		const { conditionalGroups, validators } = input
		const hasNonUniqueId = nonUniqueIds.length > 0 && nonUniqueIds.includes(inputId)

		return (
			<div className="c-builder-field-group">
				{removeEnabled && (
					<Button icon="close" onClick={this.removeInput} />
				)}
				<BasicFields
					checkForErrors={this.checkForInputErrors}
					hasNonUniqueId={hasNonUniqueId}
					input={input}
					isDropdown={DROPDOWN_TYPES.includes(input.type)}
					updateField={this.updateField}
				/>
				<OptionalFields
					checkForInputErrors={this.checkForInputErrors}
					conditionalGroups={conditionalGroups}
					inputType={input.type}
					updateField={this.updateField}
					validators={validators}
				/>
			</div>
		)
	}
}

const mapStateToProps = (initialState, { inputId }) => state => ({
	input: state.builder.inputs.inputs[inputId],
	inputError: state.builder.inputs.inputErrors[inputId],
	removePrompt: state.shared.preferences.removeInputPrompt,
	nonUniqueIds: state.builder.inputs.nonUniqueIds,
	uniqueIds: state.builder.inputs.uniqueIds
})

const mapDispatchToProps = dispatch => ({
	clearInputError: payload => dispatch(clearInputError(payload)),
	removeInput: inputId => dispatch(removeInput(inputId)),
	setInputError: payload => dispatch(setInputError(payload)),
	setModalClosed: () => dispatch(setModalClosed()),
	setModalOpen: payload => dispatch(setModalOpen(payload)),
	updateInput: payload => dispatch(updateInput(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(FieldGroup)
