import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import ConditionalGroups from './ConditionalGroups'
import ToggleFields from './ToggleFields'
import Validators from './Validators'

export default class OptionalFields extends Component {
	state = {
		needsConditionals: false,
		needsValidators: false
	}

	hideConditionals = () => {
		this.setState({ needsConditionals: false })
	}

	hideValidators = () => {
		this.setState({ needsValidators: false })
	}

	toggleState = type => () => {
		this.setState(prevState => ({
			[type]: !prevState[type]
		}))
	}

	updateConditionals = (conditionalGroups, error, path) => {
		this.props.updateField('conditionalGroups', conditionalGroups, error, path)
	}

	updateValidators = (validators, error, path) => {
		this.props.updateField('validators', validators, error, path)
	}

	render() {
		const { checkForInputErrors, conditionalGroups, inputId, inputType, updateField, validators } = this.props
		const { needsConditionals, needsValidators } = this.state
		return (
			<Fragment>
				{needsConditionals && (
					<ConditionalGroups
						checkForInputErrors={checkForInputErrors}
						conditionalGroups={conditionalGroups}
						hideConditionals={this.hideConditionals}
						inputId={inputId}
						updateConditionals={this.updateConditionals}
					/>
				)}
				{needsValidators && (
					<Validators
						checkForInputErrors={checkForInputErrors}
						hideValidators={this.hideValidators}
						inputId={inputId}
						inputType={inputType}
						updateValidators={this.updateValidators}
						validators={validators}
					/>
				)}
				<ToggleFields
					needsConditionals={needsConditionals}
					needsValidators={needsValidators}
					toggleState={this.toggleState}
				/>
			</Fragment>
		)
	}
}
