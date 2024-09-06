export default async function getFormById(id) {
	const response = await fetch(`dealreg/forms/1/formid/${id}`)
	const { forms } = await response.json()
	return forms[0]
}
