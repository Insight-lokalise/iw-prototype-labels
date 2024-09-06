import React from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput } from '@components'
import { formatDate, isRequired } from '@lib'
import { validateDateFields } from '../../helpers'

export default function Dates({
	endDate,
	handleChange,
	startDate
}) {
	return (
		<div className="c-admin-search__dates">
			<DebouncedInput
				fieldComponent="Date"
				handleChange={handleChange}
				label="Start date"
				name="startDate"
				required
        validate={validateDateFields}
				value={startDate && formatDate(startDate, 'MM/DD/YYYY') || ''}
			/>
			<DebouncedInput
				fieldComponent="Date"
        handleChange={handleChange}
				label="End date"
				name="endDate"
				required
        validate={validateDateFields}
				value={endDate && formatDate(endDate, 'MM/DD/YYYY') || ''}
			/>
		</div>
	)
}
