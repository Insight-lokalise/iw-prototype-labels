import React, { Component } from 'react'
import { Button } from '@insight/toolkit-react'
import PropTypes from 'prop-types'

import { Custom, Universal }from './Displays'

import 'react-day-picker/lib/style.css'
import 'filepond/dist/filepond.min.css'
// DealWrapper is a wrapper component to handle displaying and formatting
// of deal data. This logic is reused across many pages like Builder, Submission,
// Preview and EditDeal (should probably just make an extension of submission)
// It manages it's own data and calls it's provided onSubmit function when the deal
// is in a valid state

export default class DealWrapper extends Component {
	formData = {}
	state = {
		customValid: false,
		isLoading: false,
		submissionBlocked: false,
		universalValid: false
	}

	componentWillUnmount() {
		this.formData = {}
	}

	submitDeal = async () => {
		this.setState({ isLoading: true })

		const { onInvalid, onSubmit } = this.props
		const { customValid, submissionBlocked, universalValid } = this.state
		const isReadyToSubmit = !!(customValid && universalValid && !submissionBlocked)

		if (!isReadyToSubmit) {
			onInvalid()
		} else {
			await onSubmit(this.formData)
		}

    this.setState({ isLoading: false })
	}

	triggerSubmit = () => {
		if (this.props.disableSubmit) {
			return
		}

		this.props.emitter.emit('onSubmit')
		Promise.resolve().then(() => {
			this.submitDeal()
		})
	}

	updateFormData = (values, errors = [], name) => {
		this.called++
		const { customValid, universalValid } = this.state
		this.formData = { ...this.formData, ...values }

		if (errors.filter(Boolean).length > 0) {
			this.setState({[`${name}Valid`]: false, submissionBlocked: true })
			return
		}

		const complement = name === 'custom' ? universalValid : customValid
		this.setState(({ submissionBlocked }) => ({
			[`${name}Valid`]: true,
			submissionBlocked: complement ? false : submissionBlocked
		}))
	}

	render() {
		const { disableSubmit, emitter, entryContext, fields, formData, isEdit, showSubmit, ...rest } = this.props
		const { isLoading } = this.state
		const { manufacturer, program, salesAreaId } = fields

		console.log(fields)
		return (
			<div className="c-deal-wrapper">
        <Universal
          emitter={emitter}
          entryContext={entryContext}
          fields={fields.formFields.universal}
          formData={formData}
          isEdit={isEdit}
          manufacturer={manufacturer}
          program={program}
          salesAreaId={salesAreaId}
          updateFormData={this.updateFormData}
          {...rest}
        />
        <Custom
          emitter={emitter}
          fields={fields.formFields.custom}
          formData={formData}
          isEdit={isEdit}
          updateFormData={this.updateFormData}
        />
        {showSubmit && (
          <div className="c-deal-wrapper__submit">
            <Button className="c-deal-wrapper__submit-button" color="primary" isLoading={isLoading} onClick={this.triggerSubmit}>
              Submit
            </Button>
          </div>
        )}
			</div>
		) 
	}
}

