import React from 'react'
import PropTypes from 'prop-types'

import { IWInput, MaxLength } from '../'

export default function GenericFieldContents(props) {
  /* Keep on top */
  const {
    className,
    tooltip,
    hideLabel,
    disabled,
    input,
    label,
    maxLength,
    meta: { touched, error },
    placeholder,
    readOnly,
    regexFormat,
    required,
    showHelpIcon,
    showChildIfChecked,
    children,
    ariaLabel,
  } = props.field
  /* Keep on top */

  const showError = touched && !!error
  const showMaxLength = props.type === 'textArea' && !!maxLength
  const isCheckbox = props.type === 'checkbox'

  return (
    <IWInput
      className={className}
      customInputProps={input}
      disabled={disabled}
      errorMessage={error}
      hideLabel={hideLabel}
      label={label}
      maxLength={maxLength}
      name={input.name}
      placeholder={placeholder}
      readOnly={readOnly}
      regexFormat={regexFormat}
      required={required}
      showError={showError}
      showHelpIcon={showHelpIcon}
      tooltip={tooltip}
      type={props.type}
      ariaLabel={ariaLabel}
    >
      {showMaxLength && <MaxLength maxLength={maxLength} currentLength={input.value.length} />}
      {isCheckbox && showChildIfChecked && input.value && children}
    </IWInput>
  )
}

GenericFieldContents.propTypes = {
  field: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}
