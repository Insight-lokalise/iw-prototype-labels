import React from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import GenericFieldContents from './GenericFieldContents'
import { appliedValidate } from './validateField'

/**
 * [IWTextField description]
 * @param customValidations in props is array of validators
 * this will be extended to default validation of field
 */
export function IWTextField(props) {
  return (
    <Field
      component={_textFieldContents}
      validate={appliedValidate(props, { customValidate: props.customValidate })}
      {...props}
    />
  )
}

IWTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  regexFormat: PropTypes.string,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  customValidate: PropTypes.func,
}

function _textFieldContents(field) {
  return <GenericFieldContents field={field} type="text" />
}
