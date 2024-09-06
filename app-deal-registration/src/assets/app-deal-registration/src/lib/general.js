export const clamp = (val, min = 0, max = 100) => {
	return Math.min(Math.max(value, min), max)
}

export const enforceArray = item => Array.isArray(item) ? item : [item]

export const flatten = items => items.reduce((acc, item) => ([
	...acc,
	...(Array.isArray(item)
		? flatten(item)
		: [item]
	)
]), [])

export const mix = (first, second, mergeArrays = false) => {
	if (!first || !second || typeof first !== 'object' || typeof second !== 'object') {
		return first
	}

	const clone = { ...first }
	for (const key of Object.keys(second)) {
		if (second[key] instanceof Array && first[key] instanceof Array) {
			clone[key] = mergeArrays ? [...first[key], ...second[key]] : second[key]
		} else if (typeof second[key] === 'object' && typeof first[key] === 'object') {
			clone[key] = mix(first[key], second[key], mergeArrays)
		} else {
			clone[key] = second[key]
		}
	}
	return clone
}

export const noop = () => {}

export const uppercaseFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

export const sleep = time => new Promise(resolve => setTimeout(resolve, time))
