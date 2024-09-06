import React from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput } from '@components'
import { isRequired } from '@lib'

export default function SoldTo({
	handleChange,
	searchFieldName,
	seardchFieldValue
}) {
	const commonProps = {
		fieldComponent: 'Text',
		handleChange,
		name: searchFieldName,
		validate: isRequired,
		value: seardchFieldValue
	}

	return (
		<div className="c-admin-search__text">
			{searchFieldName === 'soldToNumber' && (
				<DebouncedInput label="Sold to number" {...commonProps} />
			)}
			{searchFieldName === 'soldToName' && (
				<DebouncedInput label="Sold to name" {...commonProps} />
			)}
		</div>
	)
}
