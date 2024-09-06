import parseConditionalValue from './parseConditionalValue'
import validatorMap from './validatorMap'

const noValidate = () => ({ validator: false })
const isConditionalRequired = (is, when, values) => {
	if (!values[when]) {
		return false
	}

	return parseConditionalValue(is, when, values)
}

const getValidatorFromMap = (result, { is, type, when, value }, values) => {
	if (type === 'required') {
		result.required = true
	} else if (type === 'conditionalRequired') {
		const isRequired = isConditionalRequired(is, when, values)
		result.required = isRequired
		return isRequired ? validatorMap['required']() : noValidate
	}

	return validatorMap[type](value)
}

const handleValidate = fns => value => {
	const messages = fns
		.map(fn => {
			const { message, validator } = fn(value)
			if (validator) {
				return message
			}
		})
		.filter(Boolean)

	if (messages.length > 0) {
		return messages[0]
	}
}

export function createValidationFunction(result, validators, values) {
	const fns = validators.map(validator => getValidatorFromMap(
		result,
		validator,
		values
	))
	return handleValidate(fns)
}

export function transformValidators({ validators = [] }, field, values) {
	const result = { ...field }
	if (validators[0].type) {
		result.validate = createValidationFunction(result, validators, values)
	}
	return result
}
