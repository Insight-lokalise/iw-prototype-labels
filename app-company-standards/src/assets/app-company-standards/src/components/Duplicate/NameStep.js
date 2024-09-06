import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function NameStep({ handleChange, label, value }) {
  return (
    <div className="o-grid">
      <div className="o-grid__item u-1/1 u-margin-bot">
        <Field
          fieldComponent={'Text'}
          handleChange={handleChange}
          label={t(label)}
          name={label}
          maxLength="50"
          required
          validate={() => {}}
          validateOnBlur
          value={value}
        />
      </div>
    </div>
  )
}

NameStep.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
