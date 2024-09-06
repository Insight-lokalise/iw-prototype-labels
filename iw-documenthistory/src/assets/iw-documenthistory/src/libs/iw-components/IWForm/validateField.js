import { t } from '@insight/toolkit-utils/lib/labels'
/**
 * validation function that generates error messages
 * @param  {string/bool} value         value of Field
 * @param  {object} props         props
 * @param  {Object} customOptions customError - string
 *                                customType - string (select, radio, checkbox)
 *                                customValidate - function that will be called with value unless...
 *                                customValidateParams - whatever params you want to call the function with
 * @return {[type]}               [description]
 */
export function validateField(value, props, customOptions = {}) {
  const { customError, label, required } = props
  const { customType, customValidate, customValidateParams } = customOptions

  if (!value) {
    if (!required) {
      return undefined
    } else {
      return requiredFieldError(label)
    }
  } else if (!customValidate) {
    return undefined
  } else if (!customValidateFunctionCall(value, customValidate, customValidateParams)) {
    return customError || invalidValueError(customType, label)
  } else {
    return undefined
  }
}

export const appliedValidate = (...lastArgs) => value => validateField(value, ...lastArgs)

function requiredFieldError(label) {
  return `${label} ${t('is required')}.`
}

function invalidValueError(customType, label) {
  const selectText = t('Please select a valid')
  const enterText = t('Please enter a valid')
  const selectMap = {
    select: true,
    radio: true,
    checkbox: true,
  }
  return `${selectMap[customType] ? selectText : enterText} ${label}.`
}

function customValidateFunctionCall(value, customValidate, customValidateParams) {
  const hasCustomValidateParams = !!customValidateParams
  return hasCustomValidateParams ? customValidate(customValidateParams) : customValidate(value)
}
