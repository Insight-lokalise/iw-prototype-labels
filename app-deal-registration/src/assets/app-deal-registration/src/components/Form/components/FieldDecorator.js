import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { COMPONENT_MAP } from './Elements'
import { FieldError, HelpText, Label } from './Decorators'

export default function FieldDecorator({ 
    className,
    helpText, 
    label,
    pristine, 
    showIcon,
    type, 
    ...rest 
}) {
    const { errors, ...fieldProps } = rest
    const component = COMPONENT_MAP[type] ? COMPONENT_MAP[type](fieldProps) : null
    const { id, required } = fieldProps

    const hasErrors = !pristine && errors.length > 0
    const optionalHelpText = helpText && <HelpText id={`${id}-help`}>{helpText}</HelpText>
    const optionalLabel = label && (
        <Label aria-invalid={hasErrors} id={id} required={required}>
            {label}
        </Label>
    )
    const fieldErrors = hasErrors && errors.map((err, index) => (
        <FieldError id={`${id}-error-${index}`} key={`${id}-${index}`} showIcon={showIcon}>
            {err}
        </FieldError>
    ))

    const classes = cn('c-form__element', {
        'has-error': hasErrors
    }, className)

    return (
        <div className={classes}>
            {optionalLabel}
            <div className="c-form__control">
                {component}
                {fieldErrors}
                {optionalHelpText}
            </div>
        </div>
    )
}

FieldDecorator.propTypes = {
    className: PropTypes.string,
    helpText: PropTypes.node,
    label: PropTypes.node,
    showIcon: PropTypes.bool,
    type: PropTypes.oneOf(Object.keys(COMPONENT_MAP))
}