import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Icon } from '@insight/toolkit-react'
import PropTypes from 'prop-types'
import { SpeedDial } from 'components'
import { addGroup } from 'state/modules/builder'

export class Fab extends Component {
	state = {
		open: false
	}

	handleOpen = () => {
		this.setState({ open: true })
	}

	handleClose = () => {
		this.setState({ open: false })
	}

	addGroup = () => {
		this.props.addGroup()
		this.props.emitter.emit('heightChange')
	}

	handleClick = () => {
		const { activeStep, emitter } = this.props
		const correctIndex = activeStep + 1
		if (activeStep === 1) {
			emitter.emit('validate', correctIndex)
		} else if (activeStep === 2) {
			emitter.emit('saveLayouts', correctIndex)
		}
	}

	saveForm = () => {
		this.props.emitter.emit('saveForm')
	}

	saveFormAndActivate = () => {
		this.props.emitter.emit('saveFormAndActivate')
	}

	render() {
		const { activeStep } = this.props
		const { open } = this.state

		return (
				<SpeedDial
					className="c-builder-fab"
					hidden={false}
					open={open}
					onBlur={this.handleClose}
					onFocus={this.handleOpen}
					onClose={this.handleClose}
					onMouseEnter={this.handleOpen}
					onMouseLeave={this.handleClose}
				>
					{activeStep === 1 && (
						<SpeedDial.Action onClick={this.addGroup} title="Add Group"><Icon className="c-fab__icon" icon="close" style={{ transform: 'rotate(45deg)' }}/></SpeedDial.Action>
					)}
					{activeStep !== 3 && (
						<SpeedDial.Action onClick={this.handleClick} title="Next step"><Icon className="c-fab__icon" icon="arrow-right" /></SpeedDial.Action>
					)}
					{activeStep === 3 && ([
						<SpeedDial.Action key="save-form" onClick={this.saveForm} title="Save form"><Icon icon="save" /></SpeedDial.Action>,
						<SpeedDial.Action key="activate-form" onClick={this.saveFormAndActivate} title="Save and activate"><Icon icon="log-in"/></SpeedDial.Action>
					])}
				</SpeedDial>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	addGroup: () => dispatch(addGroup())
})

export default connect(null, mapDispatchToProps)(Fab)
