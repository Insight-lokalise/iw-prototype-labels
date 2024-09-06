import React from 'react'
import PropTypes from 'prop-types'

export default function FieldErrorMessage(props) {
  const emptyString = ''
  return (
    <div className="form__field-msg form__field-msg--error">{props.showError ? props.errorMessage : emptyString}</div>
  )
}

FieldErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  showError: PropTypes.bool.isRequired,
}
