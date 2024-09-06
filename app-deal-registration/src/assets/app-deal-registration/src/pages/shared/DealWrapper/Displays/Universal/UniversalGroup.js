import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { validateAddress } from 'api'
import { SALES_ORG_TO_ID_MAP } from 'constants'
import UniversalInput from './UniversalInput'
import { ADDRESS_FIELDS, ADDRESS_GROUPS } from '../../constants'

export default class UniversalGroup extends Component {
	state = {
		displaySuggestions: false,
		suggestions: []
	}

	shouldComponentUpdate({ lastGroupUpdated }, prevState) {
		if (lastGroupUpdated === '' || lastGroupUpdated === this.props.group.display) {
			return true
		}
		return false
	}

	validateAddress = async () => {
		const { group, updateAddressField, updateAddressErrors, values } = this.props
		
		// If the user has an sap Account then we don't need to validarte the address because it will always come
		// from an API call that will always return a valid address
		if (values['dealInfo-sapAccount'] === 'Yes') {
			return
		}

		if (ADDRESS_GROUPS.includes(group.display)) {
			// Ensure all address fields are populated before we try to validate
			const shouldValidate = ADDRESS_FIELDS.every(field => !!values[`${group.display}-${group.display}${field}`])

			if (shouldValidate) {
				const apiArgs = ADDRESS_FIELDS.reduce((acc, key) => ({
					...acc,
					[`${key.toLowerCase()}`]: values[`${group.display}-${group.display}${key}`] 
				}), {
					accountName: values['accountInfo-accountName'],
					accountNumber: values['accountInfo-accountNumber'],
					country: values['accountInfo-accountCountry'],
					salesAreaId: SALES_ORG_TO_ID_MAP[values['dealInfo-salesOrg']]
				})

				// TODO: Cancel in-flight validation requests
				const { suggestedAddressList } = await validateAddress(apiArgs)
				if (suggestedAddressList.length === 1) {
					// If only one item is returned, don't prompt the user and simply overwrite their data
					updateAddressField(group, suggestedAddressList)
					if (this.state.showAddressError) {
						this.setState({ showAddressError: false })
					}
				} else if (suggestedAddressList.length > 1) {
					this.setState({
						displaySuggestions: true,
						showAddressError: false,
						suggestions: suggestedAddressList
					})
				} else {
					// show an error message to the user and invalidate the currently filled in address fields
					const errors = ADDRESS_FIELDS.reduce((acc, key) => ({
						...acc,
						[`${group.display}-${group.display}${key}`]: 'Please enter a valid address'
					}), {})
					updateAddressErrors(errors)
					this.setState({ displaySuggestions: false, showAddressError: true })
				}
			}
		}
	}

	render() {
		const { group, inputs, ...rest } = this.props
		return (
			<div className="c-deal-display__group is-universal">
				<div className="c-deal-display__header">
					<h5 className="c-deal-display__title">{group.name}</h5>
				</div>
				<div className="c-deal-display__inputs">
					{inputs.map((input, idx) => (
						<UniversalInput
							groupDisplay={group.display}
							groupId={group.id}
							input={input}
							key={idx}
							validateAddress={this.validateAddress}
							{...rest}
						/>
					))}
					{this.state.displaySuggestions && (
						<div className="c-deal-display__suggestions">
							{displaySuggestions.map(suggestion => (
								<div className="c-deal-display__suggestion">
									<button onClick={() => {}}>
										{suggestion.address} {suggestion.city}, {suggestion.state} {suggestion.zip}. ${suggestion.country}
									</button>
								</div>
							))}
						</div>
					)}
					{this.state.showAddressError && (
						<div className="c-deal-display__error">
							<p>Please enter a valid address</p>
						</div>
					)}
				</div>
			</div>
		)
	}
}
