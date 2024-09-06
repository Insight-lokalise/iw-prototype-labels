import React from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import SelectFieldContents from './selectFieldContents'
import { appliedValidate } from './validateField'

export function IWSelectField(props) {
  return (
    <Field component={_selectFieldContents} validate={appliedValidate(props, { customType: 'select' })} {...props} />
  )
}

IWSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  optionsArrayOrFunction: PropTypes.arrayOf(PropTypes.object),
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  selectElement: PropTypes.element,
}

function _selectFieldContents(field) {
  return (
    <SelectFieldContents
      field={field}
      optionsArrayOrFunction={field.optionsArrayOrFunction}
      selectElement={field.selectElement}
    />
  )
}
