export default async function activateForm({ formId, versionId }) {
	const response = await fetch(`dealreg/forms/activate/formid/${formId}/versionid/${versionId}`)
	return response.json()
}
