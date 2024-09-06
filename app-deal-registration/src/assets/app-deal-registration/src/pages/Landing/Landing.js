import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { getActiveForm, getManufacturers } from '@api'

import { INITIAL_LANDING_STATE } from './constants'
import {
	createFormArgs,
	transformSubmitValues,
	updateProgramState,
	validateSubmission,
} from './helpers'
import { Country, Finalize, Manufacturer, Purpose, Program } from './Sections'
import { createToast } from './toasts'

// TODO: MB --- consider changing to functional component with useEffect to monitor state chenges instead of componentDidUpdate.
export default class Landing extends Component {
	state = INITIAL_LANDING_STATE

	componentDidUpdate(prevProps, { displayAll }) {
		const {
			values: { country, purpose },
		} = this.state
		if (country && purpose && purpose !== 'templates' && !displayAll) {
			this.setState({ displayAll: true })
		}
	}

	fetchManufacturers = async () => {
		this.setState({ isFetching: true })
		let { salesAreaId, salesOrg, baseCountryId } = this.state.values.country
		typeof baseCountryId !== 'undefined'
			? (salesAreaId = baseCountryId)
			: salesAreaId
		const response = await getManufacturers(salesAreaId)
		if (response && !response.status && response[0].manufacturer) {
			return this.setState({ isFetching: false, manufacturers: response })
		}
		this.props.emitter.emit('internal:error', {
			message: `There are no manufacturers for salesOrg: ${salesOrg}`,
		})
		this.setState({ isFetching: false })
	}

	handleChange = ({ error = '', name, value }) => {
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [name]: error },
			values: { ...values, [name]: value },
		}))
	}

	handleErrors = () => {
		const errors = validateSubmission(this.state.values)
		if (errors) {
			this.props.display.addToast(createToast('invalid-landing-state'))
			this.setState({ errors })
			return true
		}
		return false
	}

	handleSubmit = async () => {
		let path = '/list'
		let state = {}

		const errors = this.handleErrors()
		if (errors) return

		const transformedValues = transformSubmitValues(this.state.values)
		if (this.state.values.purpose === 'submission') {
			const response = await getActiveForm(createFormArgs(this.state.values))
			if (response && !response.error) {
				transformedValues[`selectedForm`] = response
				path = `/submission/${response.formId}/${response.versionId}`
				state = { entry: 'local' }
			} else if (response.error) {
				return this.props.emitter.emit('internal:error', {
					message: `There are no deals found for this combination`,
				})
			}
		} else if (this.state.values.purpose === 'templates') {
			state = { templates: true }
		}

		this.props.purpose.updatePurpose(transformedValues)
		this.props.history.push(path, state)
	}

	updateManufacturers = manufacturer => {
		this.setState(({ manufacturers, values }) => ({
			manufacturers: manufacturers.concat(manufacturer),
			values: { ...values, manufacturer },
		}))
	}

	updatePrograms = (program, manufacturer) => {
		const updated = updateProgramState(program, manufacturer)
		this.setState(({ values }) => ({
			values: { ...values, ...updated },
		}))
	}

	render() {
		const { displayAll, errors, manufacturers, values } = this.state

		return (
			<div className="c-landing">
				<Purpose
					error={errors.purpose}
					handleChange={this.handleChange}
					value={values.purpose}
				/>
				<Country
					error={errors.country}
					handleChange={this.handleChange}
					value={values.country}
				/>
				{displayAll && (
					<Fragment>
						<Manufacturer
							country={values.country}
							emitter={this.props.emitter}
							error={errors.manufacturer}
							fetchManufacturers={this.fetchManufacturers}
							handleChange={this.handleChange}
							manufacturers={manufacturers}
							updateManufacturers={this.updateManufacturers}
							value={values.manufacturer}
						/>
						<Program
							country={values.country}
							emitter={this.props.emitter}
							error={errors.program}
							handleChange={this.handleChange}
							manufacturer={values.manufacturer}
							programs={values.manufacturer && values.manufacturer.programs}
							updatePrograms={this.updatePrograms}
							value={values.program}
						/>
					</Fragment>
				)}
				<Finalize onClick={this.handleSubmit} />
			</div>
		)
	}
}
