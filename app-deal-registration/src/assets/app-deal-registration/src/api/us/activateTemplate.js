export default async function activeTemplate({ templateId, versionId }) {
	const response = await fetch(`/dealreg/templates/activate/templateid/${templateId}/versionid/${versionId}`)
	return response.json()
}
