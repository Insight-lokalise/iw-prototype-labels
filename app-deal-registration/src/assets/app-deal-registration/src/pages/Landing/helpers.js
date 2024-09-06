import { uppercaseFirst } from '@lib'

export function createManufacturerArgs({ name }, { country }) {
	return {
		manufacturer: name,
		programs: [],
		salesAreaId: country.salesAreaId,
	}
}

export function getManufacturerOptions(items = []) {
	return items.length > 0
		? items.map(({ manufacturer }) => ({ text: manufacturer }))
		: items
}

export function manufacturerExists(name, manufacturers) {
	const hasDuplicates = manufacturers.some(
		({ manufacturer }) => manufacturer === name
	)
	return hasDuplicates ? 'That manufacturer already exists' : ''
}

export function createProgramArgs({ name }, { country, manufacturer }) {
	return {
		manufacturer: manufacturer.manufacturer,
		program: name,
		salesAreaId: country.salesAreaId,
	}
}

export function getProgramOptions(items = []) {
	return items.length > 0 ? items.map(item => ({ text: item })) : items
}

export function updateProgramState(name, manufacturer) {
	return {
		manufacturer: {
			...manufacturer,
			programs: manufacturer.programs.concat(name),
		},
		program: name,
	}
}

export function programExists(name, programs) {
	const hasDuplicates = programs.length > 0 && programs.includes(name)
	return hasDuplicates ? 'That program already exists' : ''
}

export function validateSubmission(values) {
	const baseKeys = ['country', 'purpose']
	const keys =
		values.purpose && values.purpose === 'templates'
			? baseKeys
			: [...baseKeys, 'manufacturer', 'program']
	const { errors, hasErrors } = keys.reduce(
		(acc, key) => {
			if (!values || !values[key]) {
				acc.errors[key] = 'This field is required'
				acc.hasErrors = true
			}
			return acc
		},
		{ errors: {}, hasErrors: false }
	)
	return hasErrors ? errors : false
}

export function transformSubmitValues(values) {
	return Object.keys(values).reduce(
		(acc, key) => ({
			...acc,
			[`selected${uppercaseFirst(key)}`]: values[key],
		}),
		{}
	)
}

export const createFormArgs = ({
	country,
	manufacturer: { manufacturer },
	program,
}) => {
	let { baseCountryId, salesAreaId } = country
	salesAreaId =
		typeof baseCountryId !== 'undefined' ? baseCountryId : salesAreaId

	return {
		manufacturer,
		program,
		salesAreaId,
	}
}
