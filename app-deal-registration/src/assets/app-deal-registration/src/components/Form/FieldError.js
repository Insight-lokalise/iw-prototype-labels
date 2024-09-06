import React from 'react'
import PropTypes from 'prop-types'

// This component is a small wrapper around forced errors that occur
// outside of a Form's normal validation. If a form has no values,
// then we need to be able to show the required field errors until a user
// interacts with the form. Once that happens this component goes away and 
// normal validation occurs
export default function FieldError({ error, value }) {
	if (error && !value) {
		return (
			<div className="c-field-error">
				<span>{error}</span>
			</div>
		)
	}
	return null
}

FieldError.propTypes = {
	error: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number, PropTypes.bool])
}

FieldError.defaultProps = {
	error: '',
	value: ''
}
