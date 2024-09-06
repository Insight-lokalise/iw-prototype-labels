import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import HeaderSteps from './HeaderSteps'

export default class Header extends Component {
	disabled = false

	handleClick = index => {
		const { activeStep, emitter, isTemplate } = this.props
		if (activeStep === 1) {
			emitter.emit('validate', index)
		} else if (activeStep === 2) {
			isTemplate ? emitter.emit('transitionStep', index) : emitter.emit('saveLayouts', index)
		} else if (activeStep === 3) {
			emitter.emit('transitionStep', index)
		}
	}

	render() {
		const { disabled } = this
		const { activeStep, isEdit, isTemplate } = this.props
		return (
			<header className="c-builder__header">
				<div className="c-builder__header-steps">
					<HeaderSteps
						activeStep={activeStep}
						disabled={disabled}
						isEdit={isEdit}
						isTemplate={isTemplate}
						onClick={this.handleClick}
					/>
				</div>
			</header>
		)
	}
}
