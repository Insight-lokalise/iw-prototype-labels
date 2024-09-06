import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { FieldLabel, FieldErrorMessage } from './'

export default function IWInput(props) {
  const isCheckbox = props.type === 'checkbox'
  const inputClassName = cn('form__field', props.className, {
    'form__field--error': props.showError,
    'form__input--checkbox': isCheckbox,
  })

  const {
    children,
    checked,
    className,
    customInputProps,
    disabled,
    errorMessage,
    hideLabel,
    label,
    maxLength,
    name,
    placeholder,
    readOnly,
    regexFormat,
    required,
    showError,
    showHelpIcon,
    tooltip,
    type,
    ...inputAttributes
  } = props

  return (
    <div>
      <FieldLabel
        className={className}
        hideLabel={hideLabel}
        label={label}
        name={name}
        regexFormat={regexFormat}
        required={required}
        showHelpIcon={showHelpIcon}
        tooltip={tooltip}
      >
        {type === 'textArea' ? (
          <textarea
            className={inputClassName}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            readOnly={readOnly}
            {...customInputProps}
            {...inputAttributes}
          />
        ) : (
          <input
            className={inputClassName}
            checked={checked}
            disabled={disabled}
            formNoValidate
            maxLength={maxLength}
            placeholder={placeholder}
            readOnly={readOnly}
            type={type}
            {...customInputProps}
            {...inputAttributes}
          />
        )}
      </FieldLabel>
      {children}
      <FieldErrorMessage errorMessage={errorMessage} showError={showError} />
    </div>
  )
}

IWInput.propTypes = {
  // required
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['checkbox', 'email', 'file', 'tel', 'text', 'textArea']).isRequired,
  // optional
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  customInputProps: PropTypes.shape({}),
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  hideLabel: PropTypes.bool,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  regexFormat: PropTypes.string,
  required: PropTypes.bool,
  showError: PropTypes.bool,
  showHelpIcon: PropTypes.bool,
  tooltip: PropTypes.node,
  // checkbox and radio specific
  checked: PropTypes.bool,
}

IWInput.defaultProps = {
  children: null,
  checked: false,
  className: '',
  customInputProps: {},
  disabled: false,
  errorMessage: '',
  hideLabel: false,
  placeholder: '',
  readOnly: false,
  regexFormat: '',
  required: false,
  showError: false,
  showHelpIcon: false,
  tooltip: null,
}
