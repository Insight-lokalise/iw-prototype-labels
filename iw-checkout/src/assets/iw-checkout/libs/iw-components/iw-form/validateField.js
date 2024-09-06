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
    const { customError, label, required, errorMessage } = props
    const { customType, customValidate, customValidateParams } = customOptions
    if(typeof value === 'string'){
        value = value.trim()
    }
    if (!value) {
        if (!required) {
            return undefined
        } 
            return errorMessage || requiredFieldError(label)
        
    } else if (!customValidate) {
        return undefined
    } else if (!customValidateFunctionCall(value, customValidate, customValidateParams)) {
        return customError || invalidValueError(customType, label)
    } 
        return undefined
    
}


function requiredFieldError(label) {
    return `${label} ${t('is required')}.`
}


function invalidValueError(customType, label) {
    const select = 'select'
    const radio = 'radio'
    const checkbox = 'checkbox'
    const customTypeSelect = customType === select || customType === radio || customType === checkbox
    return `${t('Please')} ${customTypeSelect ? t('select') : t('enter')} ${t('a valid')} ${label}.`
}


function customValidateFunctionCall(value, customValidate, customValidateParams) {
    const hasCustomValidateParams = !!customValidateParams
    return hasCustomValidateParams ?
            customValidate(customValidateParams)
        :
            customValidate(value)
}
