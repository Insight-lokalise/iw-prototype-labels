export default function parseCustomValues(values, errors, validators, inputs) {
	const { customValues, displayedErrors, passedErrors } = Object
		.keys(inputs)
		.reduce((acc, key) => {
			const { display, name } = inputs[key]
			const value = values[name] || ''
			acc.customValues[display] = value

			if (!validators[name]) {
				return acc
			}

			const error = validators[name](value)
			if (error) {
				acc.displayedErrors[name] = error
				acc.passedErrors.push(name)
			}
			return acc
		}, { customValues: {}, displayedErrors: {}, passedErrors: [] })

	const parsedValues = { custom: customValues }
	return { displayedErrors, parsedValues, passedErrors }
}
