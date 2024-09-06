export default async function searchDealsByDate(payload) {
	const response = await fetch('/dealreg/dealsByDateRange', {
		body: JSON.stringify(payload).toString(),
		method: 'POST'
	})
	return response.json()
}
