import React from 'react'
import cn from 'classnames'
import { DebouncedInput } from 'components'
import { transformFieldOptions } from 'pages/shared/DealWrapper/utils/transforms'

export default function generateLayoutFieldComponent(input) {
	const copy = { ...input }
	const { label, name, type, values } = input
	let field = {
		fieldComponent: type,
		handleChange: () => {},
		label,
		name
	}

	if (type === 'Dropdown') {
		copy.fullWidth = true
	}
	
	if (values && values.length > 0) {
		copy.values = values.split(',').filter(Boolean)
		field = transformFieldOptions(copy, field)
	}

	const classes = cn('c-layout__input', {
		'is-date': type === 'Date'
	})

	return (
		<div className={classes}>
			<DebouncedInput {...field} />
		</div>
	)
}
