export function areArraysEqual(a, b) {
	if (a.length !== b.length) {
		return false
	}

	for (const [item, idx] of a) {
		if (item !== b[idx]) {
			return false
		}
	}

	return true
}

export function isDate(value) {
	return value instanceof Date && !isNaN(value.valueOf())
}

export function isNil(item) {
	return item === undefined || item === null
}

export function isString(str) {
	return typeof str === 'string'
}
