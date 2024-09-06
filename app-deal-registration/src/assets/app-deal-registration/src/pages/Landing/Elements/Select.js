import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput, FieldError } from 'components'

const Select = memo(({
	disabled,
	error,
	handleChange,
	label,
	name,
	options,
	validate,
	value
}) => (
	<div className="c-landing__select">
		<DebouncedInput
			debounce={false}
			disabled={disabled}
			fieldComponent="Dropdown"
			fullWidth
			handleChange={handleChange}
			hasError={error}
			hasNoInitialSelection
			label={label}
			name={name}
			options={options}
			validate={validate}
			value={value}
		/>
		<FieldError error={error} value={value} />
	</div>
))

Select.propTypes = {
	disabled: PropTypes.bool,
	error: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.shape),
	validate: PropTypes.func,
	value: PropTypes.string
}

Select.defaultProps = {
	disabled: false,
	error: '',
	label: '',
	options: [],
	value: ''
}

export default Select
