export default async function getPreviewFields(id) {
	const response = await fetch(`/dealreg/deals/preview/dealid/${id}`)
	return response.json()
}
