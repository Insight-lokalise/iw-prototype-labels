export default async function getAllTemplates(salesAreaId) {
	const response = await fetch(`dealreg/templates/all/1/salesAreaid/${salesAreaId}`)
	return response.json()
}
