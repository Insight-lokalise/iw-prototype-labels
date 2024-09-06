import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { generateUniqueId } from '@insight/toolkit-utils'
import { FieldError, HelpText, Label, Legend } from '@insight/toolkit-react/lib/Form/Components/Decorators'

import { COMPONENT_MAP } from './Elements'

export default function Decorator({ fieldComponent, fieldProps }) {
	const {
		className,
		disabled,
		error,
		hasError,
		helpText,
		id = generateUniqueId(),
		label,
		legend,
		name,
		required,
		showErrorIcon,
		...rest
	} = fieldProps

	const shouldHaveLegend = fieldComponent === 'CheckboxGroup'
	const optionalHelpText = helpText && <HelpText id={`${id}-help`}>{helpText}</HelpText>
	const optionalLabel = label && !shouldHaveLegend && (
		<Label
			aria-invalid={!!error}
			id={id}
			required={required}
		>
			{label}
		</Label>
	)

	const legendValue = legend || label
	const optionalLegend = legendValue && shouldHaveLegend && <Legend required={required}>{legendValue}</Legend>
	const optionalError = error && (
		<FieldError
			id={`${id}-error`}
			showErrorIcon={showErrorIcon}
		>
			{error}
		</FieldError>
	)

	const labelElement = optionalLabel || optionalLegend
	const classes = cn('c-form__element', {
		'has-error': error || hasError
	}, className)

	const ariaProps = generateAriaProps(optionalHelpText, optionalError)
	const decoratorProps = {
		disabled,
		id,
		label,
		name,
		required,
		...rest,
		...ariaProps
	}

	const passsedComponent = COMPONENT_MAP[fieldComponent] ? COMPONENT_MAP[fieldComponent](decoratorProps) : null
	return (
		<div className={classes}>
			{labelElement}
			<div className="c-form__control">

				{passsedComponent}
				{optionalError}
				{optionalHelpText}
			</div>
		</div>
	)
}

function generateAriaProps(helptext, error) {
	const describingIds = []
	const optionalProps = {}
	if (helptext) {
		describingIds.push(helptext.props.id)
	}
	if (error) {
		describingIds.push(error.props.id)
	}

	if (describingIds.length > 0) {
		optionalProps['aria-describedby'] = describingIds.join(' ')
	}

	return optionalProps
}
