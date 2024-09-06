export default function createErrorBuffer(values) {
	return Object.keys(values).reduce((acc, key) => {
		if (values[key]) {
			acc[key] = ''
		}
		return acc
	}, {})
}
