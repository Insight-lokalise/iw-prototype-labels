import React from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput } from 'components'
import { isRequired } from 'lib'

import { SEARCH_TYPE_OPTIONS } from '../../constants'

export default function SearchTypes({
	handleChange,
	searchFieldName
}) {
	return (
		<div className="c-admin-search__select">
			<DebouncedInput
				fieldComponent="Dropdown"
				handleChange={handleChange}
				hasNoInitialSelection
				label="Search type"
				name="searchType"
				options={SEARCH_TYPE_OPTIONS}
				validate={isRequired}
				value={searchFieldName}
			/>
		</div>
	)
}
