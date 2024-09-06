import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function IpsContractsDropdown(props) {
  const { disabled, value, options } = props
  const contractFound = options.find(c => c.value === value)
  const selectedContract = !!contractFound ? value : 'Open Market'
  return (
    <Field
      disabled={disabled}
      fieldComponent={'Select'}
      fullWidth
      handleChange={props.onChange}
      label={t('IPS Contract')}
      required
      name={'IPS Contract'}
      options={props.options}
      validate={() => { }}
      validateOnBlur
      value={selectedContract}
    />
  )
}

IpsContractsDropdown.propTypes = {
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

IpsContractsDropdown.defaultProps = { disabled: false }