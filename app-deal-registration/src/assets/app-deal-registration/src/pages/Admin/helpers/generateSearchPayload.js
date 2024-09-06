function generateBasicPayload({ dateField, endDate, searchFieldName, startDate }) {
	const payload = { includeNulls: 1 }
	if (dateField) {
		payload.dateField = dateField
		payload.endDate = endDate
		payload.startDate = startDate
	}
	if (searchFieldName) {
		payload.searchFieldName = searchFieldName
	}
	return payload
}

function generateDealPayload({ dealId, dealNum }) {
	const payload = {}
	if (dealId) {
		payload.dealId = dealId
	}
	if (dealNum) {
		payload.dealNum = dealNum
	}
	return payload
}
export default function generateSearchPayload(state, props) {
	if (state.dealId || state.dealNum) {
		return {
			...generateDealPayload(state),
			salesAreaId: 1
		}
	}

	const { searchFieldName, searchFieldValue } = state
	const payload = generateBasicPayload(state)
	if (searchFieldName) {
		payload.searchFieldName = searchFieldName
	}
	if (searchFieldValue) {
		payload.searchFieldValue = searchFieldValue
	}

	return {
		...payload,
		salesAreaId: 1
	}
}
