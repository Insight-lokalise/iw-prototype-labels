import React from 'react'
import cn from 'classnames'
import { DebouncedInput, FieldError } from 'components'

export default function createField(field, { values }) {
	const { error, fieldComponent } = field
	const classes = cn('c-deal-group__field', {
		'has-error': error,
		'is-date': fieldComponent === 'Date',
		'is-listbox': fieldComponent === 'Listbox'
	})

	if (field.when && !field.when(values)) {
		return null
	}

	return (
		<div className={classes}>
			<DebouncedInput {...field} />
			<FieldError error={error} />
		</div>
	)
}
