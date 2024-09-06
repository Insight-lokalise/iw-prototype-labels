import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getAccountData, getClientlinkData, getContactData } from 'api'
import { isValidResponse } from 'lib'
import { 
	formatAccountInformation,
  formatClientlinkData,
	getInitialUniversalState,
	getPopulatedValuesForEdit,
	getUniversalEmail,
	getValidatorsForForm,
	parseUniversalValues,
	populateUniversalGroup
} from '../../utils'
import UniversalFiles from './UniversalFiles'
import UniversalGroup from './UniversalGroup'

export default class UniversalDisplay extends Component {
	constructor(props) {
		super(props)

		const { fields, groups, state } = getInitialUniversalState(props)
		this.fields = fields
		this.groups = groups
		this.state = state
	}

	async componentDidMount() {
		const { emitter, entryContext, isEdit } = this.props
		emitter.on('onSubmit', this.handleSubmit)

		if (isEdit) {
			this.getEditInfo()
		}

		if (entryContext) {
			const { entrypoint, pathArgs } = entryContext
			if (entrypoint === 'clientlink') {
				const [clientLinkData, accountData] = await Promise.all([
            getClientlinkData(pathArgs),
            getAccountData(pathArgs.soldTo, pathArgs.salesOrg)
        ])
        const response = !!(clientLinkData && accountData)
        if (response) {
          const { errorBuffer, newValues, populated } = formatAccountInformation(accountData)
          const formattedClientlinkData = formatClientlinkData(clientLinkData)
          const accountNumber = { 'accountInfo-accountNumber' : accountData.accountNumber }
          this.setState(({ errors, values }) => ({
            errors: { ...errors, ...errorBuffer },
            lastGroupUpdated: '',
            populated,
            values: { ...values, ...newValues, ...formattedClientlinkData, ...accountNumber }
          }))
        }
			}
		}
	}

	componentWillUnmount() {
		this.props.emitter.removeListener('onSubmit', this.handleSubmit)
	}

	createHandlers = () => ({
		getAccountData: this.props.create ? noop : this.getAccountData,
		getContactData: this.props.create ? noop : this.getContactData,
		handleEmailListChange: this.handleEmailChange,
		handleFieldChange: this.handleFieldChange,
		handleRepChange: this.handleRepChange,
		handleSapAccountChange: this.handleSapAccountChange,
		handleSelect: this.handleSelect,
		removeEmailItem: this.removeEmailItem
	})

	getEditInfo = async () => {
		const { accountNumber } = this.props.formData.formFields.universal.accountInfo
		const response = await getAccountData(accountNumber)
		if (response) {
			const { errorBuffer, newValues, populated } = formatAccountInformation(response)
			const setValues = Object.keys(newValues).reduce((acc, key) => {
				acc[key] = this.state.values[key] ? this.state.values[key] : newValues[key] || ''
				return acc
			}, {})
			//const correctValues = getPopulatedValuesForEdit(newValues, populated)
			this.setState(({ errors, values }) => ({
				errors: { ...errors, ...errorBuffer },
				lastGroupUpdated: '',
				populated,
				values: { ...values, ...setValues }
			}))
		}
	}
	getAccountData = async ({ target: { name, value }}, path) => {
		if (!this.state.values[path]) {
			return
		}

		const response = await getAccountData(this.state.values[path], this.state.values['dealInfo-salesOrg'])
		if (response && isValidResponse(response)) {
			const { errorBuffer, newValues, populated } = formatAccountInformation(response)
			this.setState(({ errors, values }) => ({
				errors: { ...errors, ...errorBuffer },
				lastGroupUpdated: '',
				populated,
				values: { ...values, ...newValues }
			}))
		}
	}

	getContactData = async (e, path) => {
		this.handleSelect(e, path)
		const response = await getContactData(e.target.value.split(':')[0])
		if (response && isValidResponse(response)) {
			const { errorBuffer, populatedValues } = populateUniversalGroup(response, path.split('-')[0], true)
			this.setState(({ errors, values }) => ({
				errors: { ...errors, ...errorBuffer },
				lastGroupUpdated: '',
				values: { ...values, ...populatedValues }
			}))
		}
	}

	handleEmailChange = ({ target: { name, value }}, index, error = '') => {
		const path = 'notificationEmails-notificationEmails'
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [path]: error },
			lastGroupUpdated: path.split('-')[0],
			values: { ...values, [path]: getUniversalEmail(values[path], value, index)}
		}))
	}

	handleFieldChange = ({ target: { name, value }}, path, error = '') => {
		const [lastGroupUpdated] = path.split('-')
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [path]: error },
			lastGroupUpdated,
			values: { ...values, [path]: value }
		}))
	}

	handleRepChange = ({ target: { name, value }}, path, error = '') => {
		const valuesToSet = {
			[path]: value
		}

		if (value === 'No') {
			valuesToSet['fieldRepInfo-fieldRepName'] = ''
			valuesToSet['fieldRepInfo-fieldRepEmail'] = ''
		}

		this.setState(({ errors, values }) => ({
			errors: { ...errors, [path]: error },
			lastGroupUpdated: path.split('-')[0],
			values: { ...values, ...valuesToSet }
		}))
	}

	handleSapAccountChange = ({ target: { name, value }}, path, error = '') => {
		this.setState(({ errors, values }) => ({
			errors: { ...errors, [path]: error },
			lastGroupUpdated: '',
			values: { ...values, [path]: value }
		}))
	}

	handleSelect = ({ target: { name, value }}, path, error = '') => {
		const { errorBuffer, populatedValues } = populateUniversalGroup(value, path.split('-')[0])
		this.setState(({ errors, values }) => ({
			errors: { ...errors, ...errorBuffer, [path]: error },
			lastGroupUpdated: path.split('-')[0],
			values: { ...values, ...populatedValues, [path]: value }
		}))
	}

	handleSubmit = () => {
		// This should also handle the processing of values too since it iterates over state values
		// This is large and complex enough it could potentially go into a worker
		const { errors, values } = this.state
		const validators = getValidatorsForForm(this.props.fields.inputs, 'display', values)
		const { displayedErrors, finalValues, passedErrors } = parseUniversalValues(values, errors, validators)
		this.setState(({ errors }) => ({
			errors: { ...errors, ...displayedErrors },
			lastGroupUpdated: ''
		}))
		this.props.updateFormData(finalValues, passedErrors, 'universal')
	}

	removeEmailItem = idx => {
		const path = 'notificationEmails-notificationEmails'
		this.setState(({ values }) => ({
			values: {
				...values,
				[path]: values[path].filter((item, index) => index !== idx)
			}
		}))
	}

	updateAddressErrors = errs => {
		this.setState(({ errors }) => ({
			...errors,
			...errs
		}))
	}

	updateAddressField = (group, suggestion) => {
		const { display, name } = group
		const newValues = Object.keys(suggestion).reduce((acc, key) => ({
			...acc,
			[`${display}-${display}${key}`]: suggestion[key]
		}), {})

		this.setState((({ values }) => ({
      values: {
				...values,
				...newValues
			}
		})))
	}

	updateFiles = urls => {
	  this.setState(({ values }) => ({
			values: { ...values, fileAttachments: [...urls] }
		}))
	}

	render() {
		return (
			<div className="c-deal-display c-deal-display--universal">
				<div className="c-deal-display__groups">
					{this.groups.map(group => (
						<UniversalGroup
							group={group}
							handlers={this.createHandlers()}
							inputs={this.fields[group.id]}
							isEdit={this.props.isEdit}
							key={group.id}
							updateAddressField={this.updateAddressField}
							{...this.state}
						/>
					))}
					<UniversalFiles 
						emitter={this.props.emitter} 
						fileAttachments={this.state.values && this.state.values.fileAttachments}
						updateFiles={this.updateFiles} 
					/>
				</div>
			</div>
		)
	}
}

