import { SALESORG_TO_ID_MAP } from '../constants'
import { isDateType } from './searchTypes'

function generateBasicPayload({ dateField = '', endDate, searchFieldName, startDate }) {
	const payload = { 
		dateField: isDateType(searchFieldName) ? searchFieldName : dateField,
		endDate,
		includeNulls: 1,
		startDate
	}

	if (!isDateType(searchFieldName)) {
		payload.searchFieldName = searchFieldName
	}

	return payload
}

function generateDealPayload({ dealId, dealNum, alternateDealRegNum, opportunityId }) {
	const payload = {}
	if (dealId) {
		payload.dealId = dealId
	}
	if (dealNum) {
		payload.dealNum = dealNum
	}
	if (alternateDealRegNum) {
	  payload.alternateDealRegNum = alternateDealRegNum
  }
  if (opportunityId) {
    payload.opportunityId = opportunityId
  }

	return payload
}

export default function createSearchPayload(state, props) {
	if (state.dealId || state.dealNum || state.alternateDealRegNum || state.opportunityId) {
		return {
			...generateDealPayload(state),
			salesAreaId: state.salesAreaId
		}
	}

	const { searchFieldValue } = state
	const payload = generateBasicPayload(state)
	if (searchFieldValue) {
		payload.searchFieldValue = searchFieldValue
	}


	return Object.keys(payload).reduce((acc, key) => {
		const item = payload[key]
		if (item) {
			acc[key] = item
		}
		return acc
	}, { salesAreaId: state.salesAreaId })
}
