import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

function validateQuantityField(value) {
  const errors = []
  if (value.length > 3) {
    errors.push(t('Your quantity has to be less than 1000'))
  }
  return errors
}

export default function Quantity({ value, onChange }) {
  return (
    <Field
      fieldComponent="Text"
      handleChange={onChange}
      type="tel"
      validate={validateQuantityField}
      validateOnChange
      value={value}
    />
  )
}

Quantity.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}
