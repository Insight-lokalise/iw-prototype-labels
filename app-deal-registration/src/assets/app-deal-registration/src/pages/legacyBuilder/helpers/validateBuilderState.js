import { DROPDOWN_TYPES } from '../NewFields/constants'

function validateBasic(input) {
	const keys = ['display', 'id', 'label', 'name', 'type']
	const errors = keys.reduce((acc, key) => {
		console.log(input[key])
		if (!input[key]) {
			acc.push(key)
		}
		return acc
	}, [])

	const { type, values } = input
	if (type && DROPDOWN_TYPES.includes(type) && !values) {
		errors.push('values')
	}

	return errors
}

function validateConditionals({ conditionalGroups }) {
	return Object.keys(conditionalGroups).reduce((acc, key) => {
		const group = conditionalGroups[key]
		group.forEach(({ is, when }, index) => {
			const path = `conditionalGroups-${key}-${index}`
			if (is && !when) {
				acc.push(`${path}-when`)
			} else if (when && !is) {
				acc.push(`${path}-is`)
			}
		})
		return acc
	}, [])
}

function validateValidators({ validators }) {
	const nonValueTypes = ['required', 'conditionalRequired', 'email']

	return validators.reduce((acc, curr, index) => {
		const { is, type, value, when } = curr
		const path = `validators-${index}`

		if (!type && value) {
			acc.push(`${path}-type`)
		}
		if (type === 'conditionalRequired') {
			if (!is) {
				acc.push(`${path}-is`)
			}
			if (!when) {
				acc.push(`${path}-when`)
			}
		}
		if (type && !nonValueTypes.includes(type) && !value) {
			acc.push(`${path}-value`)
		}

		return acc
	}, [])
}

function validateInput(input) {
	return [
		...validateBasic(input),
		...validateConditionals(input),
		...validateValidators(input)
	]
}

function validateFields(inputs, inputKeys) {
	return inputKeys.reduce((acc, key) => {
		const errors = validateInput(inputs[key])
		if (!errors.length > 0) {
			return acc
		}
		acc[key] = errors
		return acc
	}, {})
}

function validateGroups(groups) {
	return Object.keys(groups).reduce((acc, key) => {
		const { name } = groups[key]
		if (!name) {
			acc.push(key)
		}
		return acc
	}, [])
}

function validateUniqueIds(inputs, inputKeys) {
	const names = inputKeys.map(key => inputs[key].name)
	const unique = Array.from(new Set([ ...names ]))
	const seen = new Set()

	let nonUniqueIds = []

	if (unique.length !== names.length) {
		nonUniqueIds = inputKeys
			.map(key => {
				const value = inputs[key].name
				if (!seen.has(value)) {
					seen.add(value)
					return
				}
				if (seen.has(value)) {
					return key
				}
			})
			.filter(Boolean)
	}

	return { nonUniqueIds, uniqueIds: unique }
}

export default function validateBuilderState(groups, inputs) {
	const inputKeys = Object.keys(inputs)
	const groupErrors = validateGroups(groups)
	const inputErrors = validateFields(inputs, inputKeys)
	const { nonUniqueIds, uniqueIds } = validateUniqueIds(inputs, inputKeys)
	return { groupErrors, inputErrors, nonUniqueIds, uniqueIds }	
}
