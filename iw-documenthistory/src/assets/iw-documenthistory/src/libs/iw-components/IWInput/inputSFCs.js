import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export function IWAsterisk() {
  const asteriskText = '*'
  return <span className="form__required">{asteriskText} </span>
}

export function MaxLength(props) {
  return (
    <div className="form__help-text text-right">
      {`${props.maxLength - (props.currentLength || 0)} ${t('characters remaining')}`}
    </div>
  )
}

MaxLength.propTypes = {
  currentLength: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,
}
