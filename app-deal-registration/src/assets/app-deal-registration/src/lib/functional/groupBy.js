export default function groupBy(predicate, list) {
	if (arguments.length === 1) {
		return placeholder => groupBy(fn, placeholder)
	}

	const result = {}
	
	for (let i = 0; i < list.length; i++) {
		const item = list[i]
		const key = fn(item)
		if (!result[key]) {
			result[key] = []
		}
		result[key].push(item)
	}

	return result
}
