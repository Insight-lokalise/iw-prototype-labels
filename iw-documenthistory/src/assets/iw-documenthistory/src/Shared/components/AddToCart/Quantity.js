import React from 'react'
import PropTypes from 'prop-types'
import { IWInput } from '../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'


/**
 * An input for handling quantity. Was originally a bit more involved, can
 * probably be removed once we have the IWInput.
 */
export default function Quantity({ value, onChange, disabled }) {
  return (
    <IWInput
      className="quantity"
      labelClassName="show-for-sr quantity__label"
      inputclassname="text-center quantity__input"
      disabled={disabled}
      label={t('Item quantity')}
      name=""
      onChange={onChange}
      type="tel"
      value={value}
      maxLength={3}
    />
  )
}

Quantity.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  disabled: PropTypes.bool.isRequired,
}
