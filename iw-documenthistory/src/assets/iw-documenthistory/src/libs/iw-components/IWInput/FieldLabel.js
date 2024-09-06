import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import IWHelpIcon from './../IWTooltip/IWHelpIcon'

import { IWAsterisk } from './inputSFCs'

export default function FieldLabel(props) {
  const labelText = props.hideLabel ? null : `${props.label} `
  const isCheckbox = props.type === 'checkbox'
  return (
    <label className={cn('form__label', props.className)} htmlFor={props.name}>
      {isCheckbox && props.children}
      <span
        className={cn(
          { 'form__label--checkbox': isCheckbox, hide: props.hideLabel },
          'form__label-text',
          props.labelClassName
        )}
      >
        {labelText}
        {props.required && <IWAsterisk />}
        {!!props.regexFormat && ` (${t('format')}: ${props.regexFormat}) `}
        {props.showHelpIcon && <IWHelpIcon className={props.tooltipClass} tooltip={props.tooltip} />}
      </span>
      {!isCheckbox && props.children}
    </label>
  )
}

FieldLabel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  hideLabel: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  regexFormat: PropTypes.string,
  required: PropTypes.bool.isRequired,
  showHelpIcon: PropTypes.bool,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tooltipClass: PropTypes.string,
  type: PropTypes.string,
}

FieldLabel.defaultProps = {
  children: null,
  className: '',
  labelClassName: '',
  hideLabel: false,
  regexFormat: '',
  showHelpIcon: false,
  tooltip: '',
  tooltipClass: '',
  type: 'text',
}
