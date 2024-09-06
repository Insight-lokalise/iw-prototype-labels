export default async function validateAddress(payload) {
	const response = await fetch('/dealreg/address/verify', {
		body: JSON.stringify(payload).toString(),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	})
	return response.json()
}