import React from 'react'
import PropTypes from 'prop-types'
import { shouldDisplayDateType } from '../../helpers'
import CountryTypes from './CountryTypes'
import DateTypes from './DateTypes'
import SearchTypes from './SearchTypes'

export default function Types({
	dateField,
	handleTypeChange,
	salesAreaId,
	searchFieldName
}) {
	const shouldDisplayDates = searchFieldName !== '' && shouldDisplayDateType(searchFieldName)
	return (
		<div className="c-admin-search__types">
			<CountryTypes handleChange={handleTypeChange} salesAreaId={salesAreaId} />
			<SearchTypes handleChange={handleTypeChange} searchFieldName={searchFieldName}
			/>
			{shouldDisplayDates && (
				<DateTypes dateField={dateField} handleChange={handleTypeChange} />
			)}
		</div>
	)
}
