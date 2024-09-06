import React from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import { FieldErrorMessage, FieldLabel } from '../'
import DatePicker from '@insight/toolkit-react/lib/DatePicker/DatePicker'

import { appliedValidate } from './validateField'

/**
 * [IWDateField description]
 * @param {[type]} props [description]
 * customValidations in props is array of validators
 * this will be extended to default validation of field
 */
export function IWDateField(props) {
  return (
    <Field component={IWDateFieldContents} validate={appliedValidate(props, { customType: 'select' })} {...props} />
  )
}

IWDateField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  customValidations: PropTypes.arrayOf(PropTypes.func),
  isInput: PropTypes.bool,
}

IWDateField.defaultProps = {
  label: 'Date',
  name: 'date',
}

class IWDateFieldContents extends React.Component {
  render() {
    /* Keep on top */
    const { tooltip, hideLabel, input, label, meta: { touched, error }, required, showHelpIcon, isInput, ...rest } = this.props
    /* Keep on top */
    const emptyString = ''
    const showError = touched && !!error
    const dateClassName = `form__field ${showError ? 'form__field--error' : emptyString}`
    return (
      <div>
        <FieldLabel
          tooltip={tooltip}
          hideLabel={hideLabel}
          label={label}
          name={input.name}
          required={required}
          showHelpIcon={showHelpIcon}
        />
        <DatePicker
          isInput={isInput}
          className={dateClassName}
          selected={input.value ? input.value : null}
          {...rest}
          {...input}
          id={input.name}
        />
        {showError && <FieldErrorMessage showError={showError} messageText={error} />}
      </div>
    )
  }
}
