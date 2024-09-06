import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { FieldErrorMessage, FieldLabel } from './formSFCs'

export default function GenericFieldContents(props) {
  /* Keep on top */
  const {
    className,
    tooltip,
    hideLabel,
    input,
    label,
    maxLength,
    meta: { touched, error },
    placeholder,
    readOnly,
    regexFormat,
    required,
    showHelpIcon,
    multiple = false,
    title,
    hasError,
    errorMessage,
  } = props.field
  /* Keep on top */

  if (
    !props.type ||
    (typeof props.type === 'object' && Object.keys(props.type).length === 0)
  ) {
    console.warn('Please define an input type')
  }

  const emptyString = ''
  const showError = (touched && !!error) || (hasError)
  const errorClassName = showError ? 'form__field--error' : emptyString
  const inputClassName = cn('form__field', className, errorClassName)

  return (
    <div>
      <FieldLabel
        tooltip={tooltip}
        hideLabel={hideLabel}
        label={label}
        name={input.name}
        regexFormat={regexFormat}
        required={required}
        className={className}
        showHelpIcon={showHelpIcon}
        title={readOnly ? title : undefined}
      >
        <input
          className={inputClassName}
          type={props.type}
          {...input}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={maxLength}
          multiple={multiple}
        />
      </FieldLabel>
      <FieldErrorMessage showError={showError} messageText={error ?? errorMessage} />
    </div>
  )
}

GenericFieldContents.propTypes = {
  field: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}
