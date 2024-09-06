import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Loading } from '@insight/toolkit-react'
import { enforceArray, formatDate, isValidResponse } from 'lib'
import { searchDealsByDate, searchDealsByDeal } from 'api'

import { DATE_FORMATTER, INITIAL_SEARCH_STATE } from '../constants'
import { createSearchPayload, isDateField, isDateType, isDealField } from '../helpers'
import Searches from './Searches/Searches'
import Types from './Types/Types'

export default class Search extends Component {
	state = INITIAL_SEARCH_STATE
	
	handleFieldChange =  ({ target: { name, value } }) => {
		const stateKey = isDealField(name) || isDateField(name)
			? name
			: 'searchFieldValue'
		const stateValue = isDateField(name)
			? formatDate(value, DATE_FORMATTER)
			: value

		this.setState({ [stateKey]: stateValue })
		if (stateKey === 'searchFieldValue') {
			this.props.clearSearch()
		}
	}

	handleTypeChange = ({ target: { name, value } }) => {
		const base = { endDate: '', startDate: '' }
		const key = (name === 'dateField' || name === 'salesAreaId')
			? name
			: 'searchFieldName'
		this.setState({ [key]: value, ...base })
		this.props.clearSearch()
	}

	search = async () => {
		this.setState({ isSearching: true })
		this.props.hideOtherSections()
		const payload = createSearchPayload(this.state, this.props)
		const handler = isDealField(this.state.searchFieldName) ? searchDealsByDeal : searchDealsByDate
		const response = await handler(payload)
		if (response) {
			if (isValidResponse(response)) {
				this.props.setDeals(enforceArray(response))
				this.setState(prevState => ({
					...INITIAL_SEARCH_STATE,
					salesAreaId: prevState.salesAreaId
				}))
			} else if (response.status && response.status === 'no results found') {
				this.props.showNoResults()
			}
		}
		this.setState({ isSearching: false })
	}

	render() {
		const { dateField, isSearching, salesAreaId, searchFieldName } = this.state
		return (
			<div className="c-admin-search">
				<Types
					dateField={dateField}
					handleTypeChange={this.handleTypeChange}
					salesAreaId={salesAreaId}
					searchFieldName={searchFieldName}
				/>
				<Searches handleFieldChange={this.handleFieldChange} {...this.state} />
				<div className="c-admin-search__submit">
					<Button color="primary" onClick={this.search}>
						{isSearching ? <Loading size="small" /> : <span>Search</span>}
					</Button>
				</div>
			</div>
		)
	}
}
























