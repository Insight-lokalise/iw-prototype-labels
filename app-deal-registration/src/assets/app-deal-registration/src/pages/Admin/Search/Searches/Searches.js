import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Loading } from '@insight/toolkit-react'

import { getManufacturers } from '@api'
import { isValidResponse } from '@lib'

import { isDateType, isDealField, isSoldToField } from '../../helpers'
import Dates from './Dates'
import Deal from './Deal'
import Manufacturer from './Manufacturer'
import SoldTo from './SoldTo'

export default class Searches extends Component {
	state = {
		isFetching: false,
		manufacturers: [],
	}

	async componentDidUpdate({ salesAreaId, searchFieldName }) {
		if (
			this.props.searchFieldName === 'manufacturer' &&
			(searchFieldName !== 'manufacturer' ||
				salesAreaId !== this.props.salesAreaId)
		) {
			this.setState({ isFetching: true })
			let manufacturers = []
			const response = await getManufacturers(salesAreaId)
			if (response && isValidResponse(response)) {
				manufacturers = response
			}
			this.setState({ isFetching: false, manufacturers })
		}
	}

	render() {
		const {
			alternateDealRegNum,
			dateField,
			dealId,
			dealNum,
			endDate,
			handleFieldChange,
			opportunityId,
			salesAreaId,
			searchFieldName,
			searchFieldValue,
			startDate,
		} = this.props
		const { isFetching, manufacturers } = this.state

		const isNotDateOrDeal =
			!isDateType(searchFieldName) && !isDealField(searchFieldName)
		const shouldHideSearches =
			searchFieldName === '' ||
			(searchFieldName !== '' && isNotDateOrDeal && dateField === '') ||
			salesAreaId === ''

		const classes = cn('c-admin-search__searches', {
			'is-hidden': shouldHideSearches,
			'is-loading': isFetching,
		})

		if (shouldHideSearches) {
			return <div className={classes} />
		}

		if (isFetching) {
			return (
				<div className={classes}>
					<Loading size='small' />
				</div>
			)
		}

		const shouldDisplayDates = !isDealField(searchFieldName)
		const commonProps = {
			handleChange: handleFieldChange,
			searchFieldName,
			searchFieldValue,
		}

		return (
			<div className={classes}>
				{searchFieldName === 'manufacturer' && (
					<Manufacturer manufacturers={manufacturers} {...commonProps} />
				)}
				{isSoldToField(searchFieldName) && <SoldTo {...commonProps} />}
				{isDealField(searchFieldName) && (
					<Deal
						dealId={dealId}
						dealNum={dealNum}
						alternateDealRegNum={alternateDealRegNum}
						opportunityId={opportunityId}
						{...commonProps}
					/>
				)}
				{shouldDisplayDates && (
					<Dates
						endDate={endDate}
						handleChange={handleFieldChange}
						startDate={startDate}
					/>
				)}
			</div>
		)
	}
}
