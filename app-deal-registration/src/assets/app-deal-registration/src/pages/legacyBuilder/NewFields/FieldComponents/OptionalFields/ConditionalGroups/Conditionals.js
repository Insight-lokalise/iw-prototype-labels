import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import Conditional from './Conditional'

export default class Conditionals extends Component {
	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.conditionalGroup.length > 0 && prevState.removeConditionals) {
			return { removeConditionals: false }
		}
		return null
	}

	state = {
		removeConditionals: false
	}

	toggleRemove = () => {
		this.setState(prevState => ({
			removeConditionals: !prevState.removeConditionals
		}))
	}

	removeConditional = idx => {
		this.props.removeConditional(this.props.index, idx)
	}

	render() {
		const { addConditional, checkForInputErrors, conditionalGroup, index, updateConditional } = this.props
		const { removeConditionals } = this.state
		return (
			<div className="c-builder-field-group__conditional">
				{conditionalGroup.map((conditional, idx) => (
					<Conditional
						checkForInputErrors={checkForInputErrors}
						conditional={conditional}
						groupIndex={index}
						itemIndex={idx}
						removeConditional={this.removeConditional}
						removeEnabled={removeConditionals}
						updateConditional={updateConditional(index, idx)}
					/>
				))}
				<div className="c-builder-field-group__conditional-options">
					<Button 
						color="link"
						onClick={this.toggleRemove}
					>
						{removeConditionals ? 'Cancel Removing' : 'Remove Conditionals'}
					</Button>
					<Button
						color="link"
						onClick={addConditional(index)}
					>
						Add Another Conditional
					</Button>
				</div>
			</div>
		)
	}
}
