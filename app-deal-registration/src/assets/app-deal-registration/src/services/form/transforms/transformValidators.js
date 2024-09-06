import * as validatorMap from '../validators'
import { parseConditionalValues } from '../helpers'

const createValidators = (validators, values) => {
    let required = false
    if (validators.some(e => e.type === 'required')) {
      required = true
    }
    const fieldValidators = validators
        .map(validator => {
            if (!validator) {
                return () => false
            }

            const { type, value } = validator
            if (type === 'conditionalRequired') {
                required = parseConditionalValues(validator, values)
                return required ? validatorMap['required']() : () => false
            } else if (type === 'required') {
                return validatorMap['required']()
            }
            return validatorMap[type](value)
        })
    
    return { required, validators: fieldValidators }
}

export default function transformValidators({ validators }, values) {
    return createValidators(validators, values)
}
