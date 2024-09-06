import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { DebouncedInput } from 'components'

const STATUS_OPTIONS = [{ text: 'BOT' }, { text: 'NEW' }]

export default class QueueStatus extends Component {
	state = {
		queueStatus: 'NEW'
	}

	updateQueueStatus = ({ target: { value } }) => {
		this.setState({ queueStatus: value })
		this.props.updateQueueStatus(value)
	}

	render() {
		const { queueStatus } = this.state
		return (
			<Panel className="c-builder-finalize__status" isEmphasized >
				<Panel.Title><h5>Queue Status</h5></Panel.Title>
				<Panel.Body>
				<p>
					This field should default to NEW during the Form Builder creation.
					Update to BOT once the BOT code is approved and ready to process.
				</p>
				<div className="c-builder-finalize__status-select">
					<DebouncedInput
						fieldComponent="Dropdown"
						label="Queue Status"
						handleChange={this.updateQueueStatus}
						options={STATUS_OPTIONS}
						value={queueStatus}
					/>
				</div>
				</Panel.Body>
			</Panel>
		)
	}
}
