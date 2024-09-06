export default async function updateForm(payload) {
	const response = await fetch('/dealreg/updateForm', {
		body: JSON.stringify(payload).toString(),
		method: 'POST'
	})
	return response.json()
}
