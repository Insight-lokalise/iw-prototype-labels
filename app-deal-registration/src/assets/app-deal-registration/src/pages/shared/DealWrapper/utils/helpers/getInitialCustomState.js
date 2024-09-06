import { applyAdapter } from '../adapters'

const getGroups = ({ groups }) => Object.keys(groups).map(key => groups[key])
const getDefaultValue = type => {
	if (type === 'ListBox') {
		return []
	}
	if (type === 'Checkbox') {
		return false
	}
	return ''
}

const getInitialData = ({ inputs }, formData) => Object.keys(inputs).reduce(
	(acc, key) => {
		const input = inputs[key]
		const [split] = key.split('-')
		acc.fields[split] = [...(acc.fields[split] || []), applyAdapter(input)]

		const { display, name, type } = input
		const defaultValue = getDefaultValue(type)
		acc.values[name] = formData && formData[display] || defaultValue
		return acc
	}, { fields: {}, values: {} }
)

const baseState = { errors: {}, lastGroupUpdated: '' }

export default function getInitialCustomState({ fields: passedFields, formData }) {
	const previousValues = formData && formData.formFields && formData.formFields.custom || false
	const { fields, values } = getInitialData(passedFields, previousValues)
	return {
		fields,
		groups: getGroups(passedFields),
		state: { ...baseState, values }
	}
}
