export default async function updateAdminFields(payload) {
	const response = await fetch('/dealreg/updateAdminFields', {
		body: JSON.stringify(payload).toString(),
		method: 'POST'
	})
	return response.json()
}
