import React, { useMemo, memo } from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import CheckboxFieldContents from './checkboxFieldContents'
import { validateField } from './validateField'

function IWCheckboxField(props) {
  const _validateCheckbox = useMemo(
    () => (value) => (validateField( value, props, { customType: 'checkbox' })),
    [props.name]
  );

  return (
    <Field
      component={CheckboxFieldContents}
      validate={_validateCheckbox}
      {...props}
    />
  )
}

export default memo(IWCheckboxField)

IWCheckboxField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    showChildIfChecked: PropTypes.bool,
}
