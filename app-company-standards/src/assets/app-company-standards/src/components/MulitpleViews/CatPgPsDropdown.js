import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'

export default function CatPgPsDropdown({ onChange, options, type, value, ...rest }) {
  function handleChange(e) {
    // find the correspondingOption and return it's onChangeValue because we cannot pass an object in as a value attribute
    const correspondingOption = options.find(opt => opt.value === e.target.value)
    onChange(correspondingOption.onChangeValue)
  }

  return (
    <Field
      fieldComponent={'Select'}
      fullWidth
      handleChange={handleChange}
      name={type}
      options={options}
      value={value}
      {...rest}
    />
  )
}

CatPgPsDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      onChangeValue: PropTypes.object.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  type: PropTypes.oneOf(['Category', 'Product group', 'Product set']).isRequired,
  value: PropTypes.string.isRequired,
}
