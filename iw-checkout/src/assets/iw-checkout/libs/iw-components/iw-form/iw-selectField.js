import React, {useMemo, memo} from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import SelectFieldContents from './selectFieldContents'
import { validateField } from './validateField'

function IWSelectField(props) {
  const _validateSelect = useMemo(
    () => (value) => (validateField( value, props, { customType: 'select' })),
    [props.name, props.required]
  );

  return (
    <Field
      component={_selectFieldContents}
      validate={_validateSelect}
      {...props}
    />
  )
}

export default memo(IWSelectField)

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

