import { createValidationFunction } from '../transforms'

export default function getValidatorsForForm(inputs, path, values) {
	return Object.keys(inputs).reduce((acc, key) => {
		// Copy to avoid mutating state as createValidatorFunction
		// mutates the field it receives
		const input = { ...inputs[key] }
		const { validators } = input
		if (input.display === 'contactNumber') {
			return acc
		}
		
		if (validators && validators[0].type) {
			const fn = createValidationFunction(input, validators, values)
			acc[input[path]] = fn
		}
		return acc
	}, {})
}
