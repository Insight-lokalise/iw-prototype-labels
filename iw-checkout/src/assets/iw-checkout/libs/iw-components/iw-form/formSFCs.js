import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWHelpIcon } from '../index'

export function IWAsterisk() {
  const asteriskText = '*'
  return <span className="form__required">{asteriskText} </span>
}

export function FieldErrorMessage(props) {
  const emptyString = ''
  return (
    <div className="form__field-msg form__field-msg--error">
      {props.showError ? t(props.messageText) : emptyString}
    </div>
  )
}

FieldErrorMessage.propTypes = {
  messageText: PropTypes.string.isRequired,
  showError: PropTypes.bool.isRequired,
}

FieldErrorMessage.defaultProps = {
  messageText: '',
}

export function FieldLabel(props) {
  const labelText = props.hideLabel ? null : props.label
  const isCheckbox = props.type === 'checkbox'
  return (
    <label
      title={props.title}
      htmlFor={props.htmlFor}
      className={cn('form__label', props.className)}
    >
      {isCheckbox && props.children}
      <span
        id={props.spanId}
        className={cn(
          { 'form__label--checkbox': isCheckbox, hide: props.hideLabel },
          'form__label__text'
        )}
      >
        {`${t(labelText)}`}
        {props.required && <IWAsterisk />}
        {!!props.regexFormat && ` (${t('format')}: ${props.regexFormat}) `}
        {props.showHelpIcon && (
          <IWHelpIcon className={props.tooltipClass} tooltip={props.tooltip} />
        )}
      </span>
      {!isCheckbox && props.children}
    </label>
  )
}

FieldLabel.propTypes = {
  className: PropTypes.string,
  spanId: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  tooltipClass: PropTypes.string,
  hideLabel: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  regexFormat: PropTypes.string,
  required: PropTypes.bool.isRequired,
  showHelpIcon: PropTypes.bool.isRequired,
}

FieldLabel.defaultProps = {
  tooltip: '',
  required: false,
  showHelpIcon: false,
}
