export default async function getActiveTemplates({ country }) {
	const response = await fetch(`dealreg/templates/activeTemplates/salesAreaId/${country}`)
	return response.json()
}
