import React, { useMemo, memo } from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import GenericFieldContents from './genericFieldContents'
import { validateField } from './validateField'

/**
 * [IWTextField description]
 * @param customValidations in props is array of validators
 * this will be extended to default validation of field
 */
function IWTextField(props) {
  const _validateText = useMemo(
    () => (value) =>
      validateField(value, props, { customValidate: props.customValidate }),
    [props.name, props.required]
  )

  return (
    <Field component={_textFieldContents} validate={_validateText} {...props} />
  )
}

export default IWTextField

IWTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  regexFormat: PropTypes.string,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  customValidate: PropTypes.func,
  title: PropTypes.string,
}

function _textFieldContents(field) {
  return <GenericFieldContents field={field} type="text" />
}
