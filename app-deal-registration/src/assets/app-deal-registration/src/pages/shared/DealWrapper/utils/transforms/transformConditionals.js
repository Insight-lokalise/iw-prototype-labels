import parseConditionalValue from './parseConditionalValue'

function createFieldConditionals(groups) {
	return values => {
		const groupResults = groups.map(group => group.every(
			({ is, when }) => parseConditionalValue(is, when, values)
		))
		return groupResults.indexOf(true) !== -1
	}
}

export default function transformConditionals({ conditionalGroups }, passedField) {
	const conditionalValues = conditionalGroups && Object.values(conditionalGroups)
	if (conditionalValues && conditionalValues[0][0].when) {
		passedField.when = createFieldConditionals(conditionalValues)
	}
	return passedField
}
