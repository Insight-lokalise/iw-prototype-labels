export default function path(pathArr, obj) {
	if (arguments.length === 1) {
		return placeholder => path(pathArr, placeholder)
	}

	if (obj === null || obj === undefined) {
		return undefined
	}

	let willReturn = obj
	let counter = 0

	const pathValue = typeof pathArr === 'string'
		? pathArr.split('.')
		: pathArr

	while (counter < pathValue.length) {
		if (willReturn === null || willReturn === undefined) {
			return undefined
		}

		willReturn = willReturn[pathValue[counter]]
		counter++
	}

	return willReturn
}
