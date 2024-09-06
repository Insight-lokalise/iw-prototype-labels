import React, { Component, memo } from 'react'
import cuid from 'cuid'
import { Button } from '@insight/toolkit-react'

import { DEFAULT_VALIDATOR_STATE } from '../../../constants'
import Validator from './Validator'

export default class Validators extends Component {
	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.validators.length > 0 && prevState.removeEnabled) {
			return { removeEnabled: false }
		}
		return null
	}

	state = {
		removeEnabled: false
	}

	addValidator = () => {
		this.props.updateValidators(this.props.validators.concat(DEFAULT_VALIDATOR_STATE))
	}

	removeValidator = index => {
		const validators = this.props.validators.filter((item, idx) => index !== idx)
		if (!validators.length > 0) {
			this.setState({ removeEnabled: false })
			this.props.hideValidators()
			this.props.updateValidators([DEFAULT_VALIDATOR_STATE])
		} else {
			this.props.updateValidators(this.props.validators.filter(
				(item, idx) => index !== idx
			))
		}
	}

	toggleRemove = () => {
		this.setState(prevState => ({
			removeEnabled: !prevState.removeEnabled
		}))
	}

	updateValidator = (index, { target: { name, value }}, error, path) => {
		this.props.updateValidators(this.props.validators.map(
			(item, idx) => index === idx ? { ...item, [name]: value } : item
		), error, path)
	}

	render() {
		const { addValidator, checkForInputErrors, inputType, validators } = this.props
		const { removeEnabled } = this.state

		return (
			<div className="c-builder-field-group__validators">
				<div className="c-builder-field-group__validators-header">
					<h3>Validators</h3>
				</div>
				{validators.map((validator, index) => (
					<Validator
						checkForInputErrors={checkForInputErrors}
						key={index}
						inputType={inputType}
						itemIndex={index}
						removeEnabled={removeEnabled}
						removeValidator={this.removeValidator}
						updateValidator={this.updateValidator}
						validator={validator}
					/>
				))}
				<div className="c-builder-field-group__validators-options">
					<Button color="secondary" onClick={this.toggleRemove}>
						{removeEnabled ? 'Cancel' : 'Remove'}
					</Button>
					<Button color="primary" onClick={this.addValidator}>
						Add Another
					</Button>
				</div>
			</div>
		)
	}

}
