import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'
import { DebouncedInput } from 'components'
import { DEFAULT_EMAIL_STATE } from '../../constants'

const createEmails = ({ values = [] }) => {
	if (values.length > 1) {
		const [first, ...rest] = values
		const inputs = rest.map(value => DEFAULT_EMAIL_STATE)
		return inputs
	}
	return []
}

export default class UniversalEmails extends Component {
	state = {
		inputs: createEmails(this.props),
		removeEnabled: false
	}


	addInputs = () => {
		this.setState(({ inputs }) => ({
			inputs: inputs.concat(DEFAULT_EMAIL_STATE)
		}))
	}

	handleChange = idx => (e, error) => {
		this.props.handlers.handleEmailListChange(e, idx + 1, error)
	}

	removeInput = idx => () => {
		const removeEnabled = this.state.inputs.length > 1
		this.setState(({ inputs }) => ({
			inputs: inputs.filter((item, index) => index !== idx),
			removeEnabled
		}))
		this.props.handlers.removeEmailItem(idx + 1)
	}

	toggleRemove = () => {
		this.setState(({ removeEnabled }) => ({ removeEnabled: !removeEnabled }))
	}

	render() {
		const { values } = this.props
		const { inputs, removeEnabled } = this.state
		const inputsLength = inputs.length
		const valuesLength = values.length

		const isButtonDisabled = !values[Math.max(0, inputsLength - 1)]

		return (
			<div className="c-deal-display__emails">
				{inputs.length > 0 && inputs.map((input, idx) => (
					<Fragment key={idx}>
						<DebouncedInput
							{...input}
							handleChange={this.handleChange(idx)}
							value={values && values[idx + 1]}
						/>
						{removeEnabled && (
							<Button className="c-deal-display__input-remove" onClick={this.removeInput(idx)}>
								<Icon icon="trashcan" />
							</Button>
						)}
					</Fragment>
				))}
				<Button color="primary" disabled={isButtonDisabled} onClick={this.addInputs}>
					Add Email
				</Button>
				{inputs.length > 0 && (
					<Button onClick={this.toggleRemove}>
						{removeEnabled ? 'Cancel Removing' : 'Remove Email'}
					</Button>
				)}
			</div>
		)
	}
}
