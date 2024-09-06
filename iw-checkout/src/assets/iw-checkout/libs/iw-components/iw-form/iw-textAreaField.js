import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {Field} from 'redux-form'

import TextAreaFieldContents from './textAreaFieldContents'
import {validateField} from './validateField'

/**
 * [IWTextAreaField description]
 * @param {[type]} props [description]
 * customValidations in props is array of validators
 * this will be extended to default validation of field
 */
export function IWTextAreaField(props) {
  const _validateText = useMemo(
    () => (value) => (validateField( value, props, { customValidate: props.customValidate })),
    [props.name]
  );

  return (
    <Field
      component={_textAreaFieldContents}
      validate={_validateText}
      {...props}
    />
  )
}

IWTextAreaField.propTypes = {
    className: PropTypes.string,
    customValidate: PropTypes.func,
    label: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    name: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    regexFormat: PropTypes.string,
    required: PropTypes.bool,
}


function _textAreaFieldContents(field) {
    return <TextAreaFieldContents field={field}/>
}
