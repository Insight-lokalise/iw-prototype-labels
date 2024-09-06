export default async function getManufacturers(salesAreaId) {
	const response = await fetch(
		`/dealreg/manufacturers/1/salesAreaId/${salesAreaId}`
	)
	return response.json()
}
