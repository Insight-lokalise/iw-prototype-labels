import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from '@insight/toolkit-utils'

import { activateForm, updateForm } from 'api'
import { noop } from 'lib'
import { DealWrapper, withPurpose } from 'pages/shared'
import { generateFormPayload } from '../helpers'
import QueueStatus from './QueueStatus'

export class Finalize extends Component {
	state = {
		formId: '',
		showUrl: false,
		versionId: ''
	}

	queueStatus = 'NEW'

	componentDidMount() {
		this.props.emitter.on('saveForm', this.handleSave)
		this.props.emitter.on('saveFormAndActivate', this.handleActivate)
	}

	componentWillUnmount() {
		this.props.emitter.removeListener('saveForm', this.handleSave)
		this.props.emitter.removeListener('saveFormAndActivate', this.handleActivate)
	}

	// Needs to clean up any cached items from the storage service
	// and redirect user to list page
	afterSubmit = (formId, versionId) => {
		window.localStorage.removeItem('groupLayouts')
		window.localStorage.removeItem('childLayouts')
		this.setState({
			formId,
			showUrl: true,
			versionId
		})
	}

	handleActivate = async () => {
		const response = await this.saveForm(this.props.isEdit)
		if (response) {
			const activated = await activateForm(response)
			if (activated) {
				const { formId, versionId } = response
				this.props.emitter.emit('add-toast', {
					color: 'success',
					id: 'activate-form-success',
					text: <p>Form saved and activated successfully!</p>
				})
				this.afterSubmit(formId, versionId)
			}
		}
	}

	handleSave = async () => {
		const response = await this.saveForm(this.props.isEdit)
		if (response) {
			this.props.emitter.emit('add-toast', {
				color: 'success',
				id: 'form-save-success',
				text: <p>Form Saved Successfully</p>
			})
			this.afterSubmit()
		} else {
			// Failure
		}
	}

	saveForm = async isEdit => {
		const payload = generateFormPayload(isEdit, this.queueStatus, this.props)
		const response = await updateForm(payload)
		if (response) {
			return { formId: response, versionId: payload.versionId || 1 }
		}
		return false
	}

	updateQueueStatus = value => {
		this.queueStatus = value
	}

	render() {
		const { builder, emitter, isEdit, ...rest } = this.props
		const { formId, showUrl, versionId } = this.state

		const formFields = {
			formFields: {
				custom: {
					childLayouts: builder.groups.childLayouts,
					groups: builder.groups.groups,
					inputs: builder.inputs.inputs
				},
				universal: {
					groups: builder.universal.groups,
					inputs: builder.universal.inputs
				}
			}
		}

		return (
			<div className="c-builder-finalize">
				{!showUrl && (
					<Fragment>
					<QueueStatus updateQueueStatus={this.updateQueueStatus} />
					<DealWrapper
						disableSubmit
						formData={false}
						fields={formFields}
						isEdit={false}
						onInvalid={noop}
						onSubmit={noop}
						showSubmit
						{...rest}
					/>
					</Fragment>
				)}
				{showUrl && (
					<div className="c-builder-finalize__url">
						<p>Your Forms Url is https://dealregdb.insight.com/submission/{formId}</p>
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	builder: state.builder,
})

export default compose(
	withPurpose,
	connect(mapStateToProps)
)(Finalize)
