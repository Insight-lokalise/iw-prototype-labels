import {
	transformConditionals,
	transformFieldOptions,
	transformValidators
} from '../transforms'

export default function customAdapter(input) {
	if (input.values && input.values.length > 0) {
		input.values = input.values.split(',').filter(Boolean)
	}

	return (props, base = {}) => {
		const { errors, groupDisplay, handleChange, handleCheckbox, handleDateChange, values } = props
		const { label, name, type } = input
		const error = errors[name] || ''
		const baseField = transformValidators(input, base, values)
		const withConditionals = transformConditionals(input, baseField)
		const field = transformFieldOptions(input, withConditionals)

		if (input.type === 'Dropdown') {
			field.hasNoInitialSelection = true
			field.fullWidth = true
		}

		if (input.type === 'Checkbox') {
			field.handleChange = (e, error) => { 
				handleCheckbox(e, groupDisplay, error)
			}
			field.checked = !!values[name]
			field.debounce = false
			field.value = values[name] || false
		}
		
		if (input.type === 'Date') {
			field.handleChange = (e, error) => handleDateChange(e, groupDisplay, error)
		}
		
		if (!field.handleChange) {
			field.handleChange = (e, error) => handleChange(e, groupDisplay, error)
		}

		if (!field.value && input.type !== 'Checkbox') {
			field.value = values[name] || ''
		}

		return {
			...field,
			error,
			fieldComponent: type,
			label,
			name
		}
	}
}
