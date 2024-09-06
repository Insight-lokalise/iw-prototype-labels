import cuid from 'cuid'

export default function transformFieldOptions({ type, values = [] }, passedField) {
	let result = {}
	if (values.length > 0) {
		if (type === 'Checkbox') {
			result.checkboxLabel = values[0]
		} else if (type === 'Dropdown') {
			result.options = values.map(val => ({
				text: val
			}))
		} else if (type === 'ListBox') {
			result.options = values.map(val => ({
				label: val,
				value: val
			}))
		} else if (type === 'Radio') {
			result.options = values.map(val => ({
				// Maybe make it possible to make this dynamic
				disabled: false,
				id: cuid(),
				label: val,
				value: val
			}))
		}
	}
	return {
		...passedField,
		...result
	}
}
