import React from 'react'
import PropTypes from 'prop-types'

import { FieldErrorMessage, FieldLabel } from './formSFCs'

/**
 * creats a select dropdown given an array of options or function
 * @param {object} field                  this is the redux-form field object
 * @param {array or func} optionsArrayOrFunction if given an array must be in the following format:
 * [{dispalyName: 'Paul', value: 'Paul wrote this'}, {dispalyName: 'Jaco', value: 'Jaco is Paul\'s dog'}]
 * Alternatively, a function can be passed in that renders options however you want
 */
export default function SelectFieldContents(props) {
    /* Keep on top */
    const {
        className,
        disabled,
        tooltip,
        hideLabel,
        input,
        label,
        meta: { touched, error },
        placeholder,
        required,
        showHelpIcon,
    } = props.field
    /* Keep on top */

    const emptyString = ''
    const showError = touched && !!error
    const selectClassName = `form__field form__select ${showError ? 'form__field--error' : emptyString}`

    return (
        <div>
            <FieldLabel
                tooltip={tooltip}
                hideLabel={hideLabel}
                label={label}
                name={input.name}
                required={required}
                className={className}
                showHelpIcon={showHelpIcon}>
                {props.selectElement
                    ? React.cloneElement(props.selectElement, {
                        ...input,
                        onBlur: () => input.onBlur(input.value),
                    })
                    : <select className={selectClassName} disabled={disabled} {...input}>
                          {placeholder &&
                              <option value="" defaultValue>
                                  {placeholder}
                              </option>}
                          {Array.isArray(props.optionsArrayOrFunction)
                              ? renderOptions(props.optionsArrayOrFunction)
                              : props.optionsArrayOrFunction()}
                      </select>}
            </FieldLabel>
            <FieldErrorMessage showError={showError} messageText={error} />
        </div>
    )
}

function renderOptions(arrayOfOptions) {
    return arrayOfOptions.map(opt =>
        <option key={opt.value} value={opt.value}>
            {opt.displayName}
        </option>
    )
}

SelectFieldContents.propTypes = {
    field: PropTypes.object.isRequired,
    optionsArrayOrFunction: PropTypes.arrayOf(PropTypes.object),
    selectElement: PropTypes.element,
}
