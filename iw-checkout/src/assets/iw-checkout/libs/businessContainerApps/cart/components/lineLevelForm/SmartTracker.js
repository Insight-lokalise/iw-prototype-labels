import cn from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { t } from '@insight/toolkit-utils'
import {
  IWDateField,
  IWEmailField,
  IWSelectField,
  IWTextAreaField,
  IWTextField,
} from '../../../../iw-components/iw-form'
import SetAsMyDefault from './SetAsMyDefault'

export default function SmartTrackerField(props) {
  const {
    allowSetAsMyDefault,
    clearSetAsMyDefault,
    orderSmartTrackerValue,
    smartTracker: {
      dropDowns,
      fieldType,
      format,
      formatRegEx,
      helpText,
      helpTextExist,
      lineLevelId,
      name,
      preDefinedValue,
      readOnly,
      required,
      webFont,
    },
    usedInCart
  } = props

  const sharedProps = {
    className: cn(
      { 'smart-tracker__field--redBold': webFont === 'Red Bold' },
      { 'smart-tracker__field--blackBold': webFont === 'Black Bold' }
    ),
    label: name,
    name: usedInCart ? lineLevelId.toString() : `st-${lineLevelId}`,
    required: required,
    showHelpIcon: helpTextExist,
    tooltip: helpText,
  }

  // Creates a reusable function for the smartTracker.
  const getSmartTracker = () => {
    switch (fieldType) {
      case 'List': {
        return (
          <IWSelectField
            {...sharedProps}
            optionsArrayOrFunction={
              dropDowns &&
              [{ value: '', displayName: t('Select') }].concat(
                dropDowns.map((option) => ({
                  value: option,
                  displayName: option,
                }))
              )
            }
            disabled={readOnly}
          />
        )
      }
      case 'Text': {
        return (
          <IWTextField
            {...sharedProps}
            customValidate={(value) =>
              regexFormatValidation(value, format, formatRegEx)
            }
            readOnly={readOnly}
            regexFormat={format}
            maxLength={500}
            title={orderSmartTrackerValue}
          />
        )
      }
      case 'Email': {
        return (
          <IWEmailField
            {...sharedProps}
            readOnly={readOnly}
            multiple={true}
            maxLength={256}
          />
        )
      }
      case 'Date': {
        return (
          <IWDateField
            {...sharedProps}
            customValidate={(value) =>
              regexFormatValidation(value, format, formatRegEx)
            }
            readOnly={readOnly}
          />
        )
      }
      case 'TextBox': {
        return (
          <IWTextAreaField
            {...sharedProps}
            customValidate={(value) =>
              regexFormatValidation(value, format, formatRegEx)
            }
            maxLength={500}
            readOnly={readOnly}
            regexFormat={format}
          />
        )
      }
      default: {
        console.warn('Smarttracker type not found')
        return null
      }
    }
  }

  // If this is a header level smart tracker field, wrap with SetAsMyDefault
  if (allowSetAsMyDefault) {
    return (
      <SetAsMyDefault
        clearSetAsMyDefault={clearSetAsMyDefault}
        defaultValue={preDefinedValue}
        name={'samd-' + lineLevelId}
        readOnly={readOnly}
        value={orderSmartTrackerValue}
      >
        {getSmartTracker()}
      </SetAsMyDefault>
    )
  } else {
    return getSmartTracker()
  }
}

SmartTrackerField.defaultProps = {
  allowSetAsMyDefault: false,
}

SmartTrackerField.propTypes = {
  allowSetAsMyDefault: PropTypes.bool,
  clearSetAsMyDefault: PropTypes.func,
  orderSmartTrackerValue: PropTypes.string,
  usedInCart: PropTypes.bool,
}

function regexFormatValidation(value, format, formatRegEx) {
  // user has an option to have multiple regex for smarttrackers
  const formatArray =
    formatRegEx === '' || formatRegEx === null ? [] : formatRegEx.split(',')
  const isValid =
    formatArray.length > 0 ? reduceRegExArray(value, format, formatArray) : true
  return isValid
}

// acc should start with true, else it will quit even before validating for first time
function reduceRegExArray(value, format, formatArray) {
  return formatArray.reduce((acc, format) => {
    const regexTest = new RegExp(format, 'ig')
    const matches = value.match(regexTest)
    return !acc
      ? acc
      : matches && matches.length === 1 && matches[0].length === value.length
  }, true)
}
