import React from 'react'
import { FieldErrorMessage, FieldLabel } from './formSFCs'

export default function CheckboxFieldContents(field) {
    /* Keep on top */
    const {
        className,
        disabled,
        tooltip,
        hideLabel,
        input,
        label,
        meta: { touched, error },
        required,
        showChildIfChecked,
        showHelpIcon,
    } = field
    /* Keep on top */

    const emptyString = ''
    const showError = touched && !!error
        const errorClassName = showError ? 'form__field--error' : emptyString
    const inputClassName = `form__field form__input--checkbox${errorClassName}`

    return (
        <div className=''>
            <FieldLabel
                tooltip={tooltip}
                hideLabel={hideLabel}
                label={label}
                name={input.name}
                required={required}
                showHelpIcon={showHelpIcon}
                className={className}
                type="checkbox"
                >
                <input
                    className={inputClassName}
                    checked={input.value}
                    disabled={disabled}
                    type='checkbox'
                    {...input}
                />
            </FieldLabel>
            { showChildIfChecked && input.value && field.children }
            <FieldErrorMessage showError={showError} messageText={error}/>
        </div>
    )
}
