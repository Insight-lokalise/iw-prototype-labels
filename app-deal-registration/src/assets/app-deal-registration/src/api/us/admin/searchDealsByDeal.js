const generateUrlAddition = ({ alternateDealRegNum, dealId, dealNum, opportunityId }) => {
	if (dealId && !dealNum) {
		return `dealid/${dealId}`
	}
	if (dealNum && !dealId) {
		return `dealregnum/${dealNum}`
	}
	if (dealId && dealNum) {
		return `dealid/${dealId}/dealregnum/${dealNum}`
	}
	if (alternateDealRegNum) {
	  return `alternateDealRegNum/${alternateDealRegNum}`
  }
  if (opportunityId) {
	  return `opportunityId/${opportunityId}`
  }
}

export default async function searchDealsByDeal(payload) {
	const baseString = 'dealreg/deals/1/'
	const searchString = baseString + generateUrlAddition(payload)
	const response = await fetch(searchString)
	return response.json()
}
