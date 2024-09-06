import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RGL, { WidthProvider } from 'react-grid-layout'
import { formatDate } from 'lib'

import {
	getInitialCustomState,
	getValidatorsForForm,
	parseCustomValues,
} from '../../utils'
import CustomGroup from './CustomGroup'

const ReactGridLayout = WidthProvider(RGL)

export default class CustomDisplay extends Component {
	constructor(props) {
		super(props)

		const { fields, groups, state } = getInitialCustomState(props)
		console.log(state)
		this.fields = fields
		this.groups = groups
		this.state = state
	}

	componentDidMount() {
		this.props.emitter.on('onSubmit', this.handleSubmit)
	}

	componentWillUnmount() {
		this.props.emitter.removeListener('onSubmit', this.handleSubmit)
	}

	handleCheckboxChange = ({ target: { name }}, path, error = '') => {
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [name]: error },
			lastGroupUpdated: path,
			values: { ...values, [name]: values[name] ? false : true }
		}))
	}

	handleDateChange = ({ target: { name, value }}, path, error = '') => {
		const formatted = formatDate(value, 'MM/DD/YYYY')
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [name]: error },
			lastGroupUpdated: path,
			values: { ...values, [name]: formatted }
		}))
	}

	handleFieldChange = ({ target: { name, value }}, path, error = '') => {
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [name]: error },
			lastGroupUpdated: path,
			values: { ...values, [name]: value }
		}))
	}

	handleSubmit = () => {
		const { values, errors } = this.state
		const validators = getValidatorsForForm(this.props.fields.inputs, 'name', values)
		const { displayedErrors, parsedValues, passedErrors } = parseCustomValues(
			values,
			errors,
			validators,
			this.props.fields.inputs
		)
		this.setState(({ errors }) => ({
			errors: { ...errors, ...displayedErrors },
			lastGroupUpdated: '',
		}))
		this.props.updateFormData(parsedValues, passedErrors, 'custom')
	}

	render() {
		const { childLayouts } = this.props.fields

		return (
			<div className='c-deal-display c-deal-display--custom'>
				<div className='c-deal-display__groups'>
					<ReactGridLayout
						className='c-deal-display__grid'
						cols={12}
						isDraggable={false}
						isResizable={false}
						rowHeight={65}
					>
						{this.groups.map(group => (
							<div
								className='c-deal-display__group'
								data-grid={group.layout}
								key={group.id}
							>
								<CustomGroup
									childLayouts={childLayouts[group.id]}
									group={group}
									handleChange={this.handleFieldChange}
									handleCheckbox={this.handleCheckboxChange}
									handleDateChange={this.handleDateChange}
									inputs={this.fields}
									{...this.state}
								/>
							</div>
						))}
					</ReactGridLayout>
				</div>
			</div>
		)
	}
}
