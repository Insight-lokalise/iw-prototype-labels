import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput, FieldError } from 'components'
import { PURPOSE_OPTIONS } from '../constants'

const Purpose = memo(({ error, handleChange, value }, fieldError) => {
	const onChange = ({ target: { name, value } }) => {
		handleChange({ error: fieldError, name, value })
	}

	return (
		<div className="c-landing__section">
			<DebouncedInput
				debounce={false}
				error={error}
				fieldComponent="Radio"
				handleChange={onChange}
				label="What would you like to do?"
				name="purpose"
				options={PURPOSE_OPTIONS}
				value={value}
			/>
			<FieldError error={error} value={value} />
		</div>
	)
})

export default Purpose
