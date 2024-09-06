import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

export default function ToggleFields({
	needsConditionals,
	needsValidators,
	toggleState
}) {
	const conditionalText = needsConditionals ? 'Hide Conditionals' : 'Show Conditionals'
	const validatorText = needsValidators ? 'Hide Validators' : 'Show Validators'
	return (
		<div className="c-builder-field-group__toggle">
			<Button color="link" onClick={toggleState('needsConditionals')}>{conditionalText}</Button>
			<Button color="link" onClick={toggleState('needsValidators')}>{validatorText}</Button>
		</div>
	)
}

ToggleFields.propTypes = {
	needsConditionals: PropTypes.bool.isRequired,
	needsValidators: PropTypes.bool.isRequired,
	toggleState: PropTypes.func.isRequired
}
