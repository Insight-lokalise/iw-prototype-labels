import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function ConfigSkuDropdown({ disabled, onChange, options, value }) {
  return (
    options.length > 0 && (
      <Field
        disabled={disabled}
        fieldComponent={'Select'}
        fullWidth
        handleChange={onChange}
        label={t('Configuration SKU')}
        name={'Configuration SKU'}
        options={options}
        value={value}
      />
    )
  )
}

ConfigSkuDropdown.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
}

ConfigSkuDropdown.defaultProps = { disabled: false }