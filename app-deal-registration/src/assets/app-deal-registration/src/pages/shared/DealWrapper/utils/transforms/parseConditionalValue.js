const BOOLEAN_MAP = ['true', 'True', 'TRUE', 'false', 'False', 'FALSE']
const formatString = str => (typeof str === 'string' ? str : str.toString())
	.trim()
	.toLowerCase()

export default function parseConditionalValue(is, when, values) {
	const split = is.split(',')
	const value = Array.isArray(values[when])
		? values[when].filter(Boolean)
		: formatString(values[when])

	return split.some(passing => {
		const formatted = formatString(passing)
		if (BOOLEAN_MAP.includes(formatted)) {
			return !!value
		}

		if (Array.isArray(value)) {
			return value.indexOf(formatted) !== -1
		}

		return value === formatted
	})
}
