import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from '@insight/toolkit-react'
import { 
	clearUniversalFieldError,
	removeUniversalField,
	setUniversalFieldError,
	updateUniversalField
} from 'state/modules/builder'

import { DROPDOWN_TYPES } from '../constants'
import { BasicFields } from '../FieldComponents'

export class UniversalInput extends Component {
	checkForInputErrors = name => {
		return this.props.inputError.includes(name)
	}

	handleInputError = (error, name) => {
		const { clearUniversalFieldError, inputError, inputId, setUniversalFieldError } = this.props
		if (error && !inputError.includes(name)) {
			setUniversalFieldError({ inputId, name })
		} else if (!error && inputError.includes(name)) {
			clearUniversalFieldError({ inputId, name })
		}
	}

	removeInput = () => {
		this.props.removeUniversalField(this.props.inputId)
	}

	updateField = (name, value, error, path) => {
		const { input, inputId, updateUniversalField } = this.props
		let actualName = path || name
		updateUniversalField({ inputId, name, value })
		this.handleInputError(error, actualName)
	}

	render() {
		const { input, inputId } = this.props
		return (
			<div className="c-builder-fields__universal-input">
				<Button className="c-builder-fields__universal-remove" onClick={this.removeInput}>
					<Icon type="error" icon="trashcan" />
				</Button>
				<BasicFields
					checkForErrors={this.checkForInputErrors}
					input={input}
					isDropdown={DROPDOWN_TYPES.includes(input.type)}
					isUniversal
					updateField={this.updateField}
				/>
			</div>
		)
	}
}


const mapStateToProps = (initialState, { inputId }) => state => ({
	input: state.builder.universal.inputs[inputId],
	inputError: state.builder.universal.inputErrors[inputId]
})

const mapDispatchToProps = dispatch => ({
	clearUniversalFieldError: payload => dispatch(clearUniversalFieldError(payload)),
	removeUniversalField: payload => dispatch(removeUniversalField(payload)),
	setUniversalFieldError: payload => dispatch(setUniversalFieldError(payload)),
	updateUniversalField: payload => dispatch(updateUniversalField(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(UniversalInput)
