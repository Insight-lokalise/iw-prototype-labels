import { compose } from '@insight/toolkit-utils'

function getConditionalSubscriptions({ conditionalGroups }) {
	return result => {
		let subscriptions = []
		const values = conditionalGroups && Object.values(conditionalGroups)
		if (values[0][0].when) {
			subscriptions = values.reduce((acc, curr) => ([
				...acc,
				...(curr.map(({ when }) => when))
			]), [])
		}
		return [...result, ...subscriptions]
	}
}

function getValidatorSubscriptions({ validators }) {
	return result => {
		let subscriptions = []
		if (validators && validators[0].type) {
			subscriptions = validators.map(({ when }) => when)
		}
		return [...result, ...subscriptions]
	}
}

export default function getSubscriptions(field, path, returnUnique = false) {
	const subscriptions = compose(
		getConditionalSubscriptions(field),
		getValidatorSubscriptions(field)
	)([field[path]])

	return returnUnique
		? Array.from(new Set([...subscriptions]))
		: subscriptions
}
