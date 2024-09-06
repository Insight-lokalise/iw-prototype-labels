import React from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { FieldErrorMessage, FieldLabel } from '../'

// TODO figure out best way to validate for radio
/**
 * this will create a raido field
 * @param {object} props there are three required props and one optional
 * label,name and radioOptions are required
 * radioOptions should be an array of object like the following:
 * [{ displayName: 'man', value: 'male' }, { displayName: 'woman', value: 'female' }]
 * optionRenderer is an optional prop that takes a function and returns a string or
 * a stateless functional component
 */
export function IWRadioField(props) {
  return (
    <div>
      <FieldLabel
        tooltip={props.tooltip}
        hideLabel={props.hideLabel}
        label={props.label}
        name={props.name}
        required={props.required}
        showHelpIcon={props.showHelpIcon}
      />
      {renderRadioFields(props)}
      <FieldErrorMessage showError={false} />
    </div>
  )
}

IWRadioField.propTypes = {
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  hideLabel: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  optionRenderer: PropTypes.func,
  radioOptions: PropTypes.array.isRequired,
  required: PropTypes.bool,
  showHelpIcon: PropTypes.bool,
}

function renderRadioFields(props) {
  return (
    <div>
      {props.radioOptions.map(opt => (
        <div key={opt.value}>
          <label className={cn('form__label--inline', { 'form__label__radio--readonly ': props.disabled })}>
            <Field component={_radioFieldContents} name={props.name} type="radio" value={opt.value} {...props} />
            {props.optionRenderer ? props.optionRenderer(opt) : opt.displayName}
          </label>
        </div>
      ))}
    </div>
  )
}

function _radioFieldContents(field) {
  return <input type="radio" disabled={field.disabled} {...field.input} />
}
