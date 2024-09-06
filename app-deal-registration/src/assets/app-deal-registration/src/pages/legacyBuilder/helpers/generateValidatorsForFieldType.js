const typeToValidatorMap = {
	'Date': ['afterDay', 'beforeDay'],
	'Number': ['greaterThan', 'lessThan'],
	'Text': ['email', 'maxLength', 'minLength'],
	'TextArea': ['maxLength', 'minLength']
}

export default function generateValidatorsForFieldType(type) {
	const base = ['conditionalRequired', 'required']
	const validators = [
		...base,
		...(typeToValidatorMap[type] || [])
	]

	return validators.map(value => ({
		text: value
	}))
}
