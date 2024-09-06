export default async function updateDeal(payload) {
	const response = await fetch('/dealreg/updateDeal', {
		body: JSON.stringify(payload).toString(),
		method: 'POST'
	})
	return response.json()
}
