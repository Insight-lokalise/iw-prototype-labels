import React from 'react'
import PropTypes from 'prop-types'

import { DebouncedInput } from 'components'
import { DATE_TYPE_OPTIONS } from '../../constants'

export default function DateTypes({
	dateField,
	handleChange
}) {
	return (
		<div className="c-admin-search__select date-type">
			<DebouncedInput
				fieldComponent="Dropdown"
				handleChange={handleChange}
				hasNoInitialSelection
				label="Date type"
				name="dateField"
				options={DATE_TYPE_OPTIONS}
				value={dateField}
			/>
		</div>
	)
}
